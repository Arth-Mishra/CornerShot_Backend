import { Module } from '@nestjs/common';
import { ProductionService } from 'src/services/production/production.service';
import { ProductionController } from '../controllers/production/production.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Production } from 'src/models/production.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Production])],
  providers: [ProductionService],
  controllers: [ProductionController],
})
export class ProductionModule {}
