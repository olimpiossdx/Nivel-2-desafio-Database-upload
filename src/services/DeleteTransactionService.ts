import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const transactionExist = await transactionsRepository.findOne(id);

    if (!transactionExist) {
      throw new AppError('Transaction not found!');
    } else {
      await transactionsRepository.remove(transactionExist);
    }
  }
}

export default DeleteTransactionService;
