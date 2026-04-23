import 'package:dartz/dartz.dart';
import 'package:waste2taste/core/errors/failure.dart';
import 'package:waste2taste/Features/products/data/models/add_review_model.dart';
import 'package:waste2taste/Features/products/data/models/add_review_response_model.dart';
import 'package:waste2taste/Features/products/domain/entities/review_entity.dart';

abstract class ProductRepo {
  Future<Either<Failure, List<ReviewEntity>>> getProductReviews(String productId);
  Future<Either<Failure, AddReviewResponseModel>> addReview(AddReviewModel review);
  Future<Either<Failure, void>> deleteReview(int reviewId);
}
