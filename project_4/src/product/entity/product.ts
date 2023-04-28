import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  image?: string;
}

