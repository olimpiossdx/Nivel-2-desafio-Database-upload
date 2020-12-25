import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';

import Transaction from '../models/Transaction';
import CategoryRepository from '../repositories/CategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const balance = await transactionsRepository.getBalance();
    const result = balance.total < value;

    if (type === 'outcome' && result) {
      throw new AppError('Transaction without a valid balance');
    }

    let findTransactionInCategory = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    let transaction = new Transaction();

    if (!findTransactionInCategory) {
      findTransactionInCategory = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(findTransactionInCategory);
    }

    transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: findTransactionInCategory,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
