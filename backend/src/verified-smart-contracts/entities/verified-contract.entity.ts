import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { ContractSourceCode } from './contract-source-code.entity';

@Entity('verified_contracts')
export class VerifiedContract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 42, unique: true })
  address: string;

  @Column({ length: 255, nullable: true })
  contractName: string;

  @Column({ length: 100, nullable: true })
  compiler: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'float', nullable: true })
  riskScore: number;

  @OneToOne(() => ContractSourceCode, (sourceCode) => sourceCode.contract)
  sourceCode: ContractSourceCode;
}
