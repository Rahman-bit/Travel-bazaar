import { PartialType } from '@nestjs/mapped-types';
import { CreateCreateitineraryDto } from './itinerary.dto';

export class UpdateCreateitineraryDto extends PartialType(CreateCreateitineraryDto) {}
