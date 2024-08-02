export class DrawEntriesResponseDto {
  id: number;
  header_rating: number;
  healer_rating: number;
  header_entries: number;
  healer_entries: number;
  contestant: {
    name: string;
  };
}
