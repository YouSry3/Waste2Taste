import 'package:dartz/dartz.dart';
import 'package:waste2taste/core/errors/failure.dart';
import 'package:waste2taste/core/usecase/use_case.dart';
import 'package:waste2taste/Features/products/domain/repos/product_repo.dart';

class DeleteReviewUseCase extends UseCase<void, int> {
  final ProductRepo productRepo;

  DeleteReviewUseCase({required this.productRepo});

  @override
  Future<Either<Failure, void>> call(int param) {
    return productRepo.deleteReview(param);
  }
}
