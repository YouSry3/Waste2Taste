import 'package:dartz/dartz.dart';
import 'package:waste2taste/core/errors/failure.dart';
import 'package:waste2taste/Features/products/domain/repos/product_repo.dart';

class ToggleFavoriteUsecase {
  final ProductRepo productRepo;

  ToggleFavoriteUsecase({required this.productRepo});

  Future<Either<Failure, void>> call(String productId) async {
    return await productRepo.toggleFavorite(productId);
  }
}
