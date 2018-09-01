export class QartForm {
  constructor(
    public content: string,
    public xpos: number,
    public ypos: number,
    public width: number,
    public img: File|null,
    public embed: boolean
  ) {
  }
}


export interface QartResponse {
  error: string;
  imageURL: string;
}
