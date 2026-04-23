import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:waste2taste/core/errors/failure.dart';
import 'package:waste2taste/Features/products/domain/entities/review_entity.dart';
import 'package:waste2taste/Features/products/domain/repos/product_repo.dart';
import 'package:waste2taste/Features/products/data/data_sources/product_remote_data_source.dart';
import 'package:waste2taste/Features/products/data/models/add_review_model.dart';
import 'package:waste2taste/Features/products/data/models/add_review_response_model.dart';

class ProductRepoImpl implements ProductRepo {
  final ProductRemoteDataSource productRemoteDataSource;

  ProductRepoImpl({required this.productRemoteDataSource});

  @override
  Future<Either<Failure, List<ReviewEntity>>> getProductReviews(
    String productId,
  ) async {
    try {
      final reviews = await productRemoteDataSource.getProductReviews(
        productId,
      );
      return Right(reviews);
    } catch (e) {
      if (e is DioException) {
        return Left(ServerFailure.fromDioException(e));
      }
      return Left(ServerFailure(errorMessage: e.toString()));
    }
  }

  @override
  Future<Either<Failure, AddReviewResponseModel>> addReview(
    AddReviewModel review,
  ) async {
    try {
      final response = await productRemoteDataSource.addReview(review);
      return Right(response);
    } catch (e) {
      if (e is DioException) {
        return Left(ServerFailure.fromDioException(e));
      }
      return Left(ServerFailure(errorMessage: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteReview(int reviewId) async {
    try {
      await productRemoteDataSource.deleteReview(reviewId);
      return const Right(null);
    } catch (e) {
      if (e is DioException) {
        return Left(ServerFailure.fromDioException(e));
      }
      return Left(ServerFailure(errorMessage: e.toString()));
    }
  }
}
