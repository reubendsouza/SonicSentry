import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VerifiedContract } from './verified-contract.entity';

@Entity('contract_source_codes')
export class ContractSourceCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contractId: number;

  @Column('text', { nullable: true })
  sourceCode: string;

  @Column('jsonb', { nullable: true })
  abi: any;

  @Column({ length: 100, nullable: true })
  compilerVersion: string;

  @Column({ nullable: true })
  optimizationUsed: boolean;

  @Column({ nullable: true })
  optimizationRuns: number;

  @Column('jsonb')
  rawResponse: any;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fetchedAt: Date;

  @Column('jsonb', { nullable: true })
  vulnerabilities: any;

  @ManyToOne(() => VerifiedContract, (contract) => contract.sourceCode)
  @JoinColumn({ name: 'contractId' })
  contract: VerifiedContract;
}
