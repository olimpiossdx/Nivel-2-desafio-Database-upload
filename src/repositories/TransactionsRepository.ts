import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const incomeAmount = transactions.reduce((income, transation) => {
      if (transation.type === 'income') {
        return income + parseFloat(transation.value as any);
      }
      return income;
    }, 0);

    const outcomeAmount = transactions.reduce((income, transation) => {
      if (transation.type === 'outcome') {
        return income + parseFloat(transation.value as any);
      }
      return income;
    }, 0);

    return {
      income: incomeAmount,
      outcome: outcomeAmount,
      total: incomeAmount - outcomeAmount,
    };
  }
}

export default TransactionsRepository;
