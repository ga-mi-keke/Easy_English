// src/content/dto/generated-content.dto.ts などを作成
export interface GeneratedQuestion {
  questionEn: string;
  choices: string[];
  correctChoice: number;
}

export interface GeneratedContent {
  passage: string;
  questions: GeneratedQuestion[];
}