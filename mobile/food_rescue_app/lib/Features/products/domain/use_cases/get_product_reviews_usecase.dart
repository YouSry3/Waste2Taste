import 'package:dartz/dartz.dart';
import 'package:waste2taste/core/errors/failure.dart';
import 'package:waste2taste/core/usecase/use_case.dart';
import 'package:waste2taste/Features/products/domain/entities/review_entity.dart';
import 'package:waste2taste/Features/products/domain/repos/product_repo.dart';

class GetProductReviewsUsecase extends UseCase<List<ReviewEntity>, String> {
  final ProductRepo productRepo;

  GetProductReviewsUsecase({required this.productRepo});

  @override
  Future<Either<Failure, List<ReviewEntity>>> call(String param) {
    return productRepo.getProductReviews(param);
  }
}
