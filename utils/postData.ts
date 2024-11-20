// Code from lecture or modified code from lecture
import { LocationObjectCoords } from "expo-location";

export interface PostData {
  title: string;
  description: string;
  id: string;
  hashtags: string;
  author: string;
  authorId: string;
  isLiked: boolean;
  likes: string[];
  imageURL: string;
  postCoordinates: LocationObjectCoords | null;
  comments: string[];
  isDeleted?: boolean;
}

export interface CommentObject {
  id: string;
  comment: CommentData;
}

export interface CommentData {
  authorId: string;
  authorName: string;
  comment: string;
}
