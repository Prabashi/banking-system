export interface ITransaction {
  get type(): string;
  get amount(): number;
  get date(): string;
  get uniqueId(): string;
}
