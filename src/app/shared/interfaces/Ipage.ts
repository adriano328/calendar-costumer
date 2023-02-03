import { ISort } from "./ISort";

export interface IPage<tipo> {
  length: any;
  content: tipo[];
  pageable: string;
  totalElements: number;
  last: boolean;
  totalPages: number;
  size: number;
  number: number;
  sort: ISort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
