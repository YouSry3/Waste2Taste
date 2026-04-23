import 'package:dartz/dartz.dart';
import 'package:waste2taste/core/errors/failure.dart';
import 'package:waste2taste/core/usecase/use_case.dart';
import 'package:waste2taste/Features/products/data/models/add_review_model.dart';
import 'package:waste2taste/Features/products/data/models/add_review_response_model.dart';
import 'package:waste2taste/Features/products/domain/repos/product_repo.dart';

class AddReviewUseCase extends UseCase<AddReviewResponseModel, AddReviewModel> {
  final ProductRepo productRepo;

  AddReviewUseCase({required this.productRepo});

  @override
  Future<Either<Failure, AddReviewResponseModel>> call(AddReviewModel param) {
    return productRepo.addReview(param);
  }
}
