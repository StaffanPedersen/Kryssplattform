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
  averageRating?: number;
  ratingsCount?: number;
  isDeleted?: boolean;
  userRating?: { [key: string]: number }; // Added missing closing brace and semicolon
}

export interface CommentData {
  authorId: string;
  authorName: string;
  comment: string;
}
