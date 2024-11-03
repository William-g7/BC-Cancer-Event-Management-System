import { Role, Account } from '../types/account.types';
import  {AccountRepository} from '../repositories/accountRepository';
import bcrypt from 'bcrypt';
import { Pool } from 'mysql2/promise';

export class LoginService {
    constructor(private pool: Pool) {}
    private accountRepository = new AccountRepository(this.pool);

    async login(username: string, password: string): Promise<Account | null> {
        const account = await this.accountRepository.findByUsername(username);
        console.log('account:', account);
        if (!account) {
            return null;
        }

        const passwordMatch = (password === account.password_hash);
        console.log('Stored hashed password:', account.password_hash);
        console.log('passwordMatch:', passwordMatch);
        if (!passwordMatch) {
            return null;
        }

        return account;
    }
}





