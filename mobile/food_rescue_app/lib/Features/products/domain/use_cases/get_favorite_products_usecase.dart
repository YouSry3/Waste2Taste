import 'package:dartz/dartz.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'package:waste2taste/Features/products/domain/repos/product_repo.dart';
import 'package:waste2taste/core/errors/failure.dart';

class GetFavoriteProductsUsecase {
  final ProductRepo productRepo;

  GetFavoriteProductsUsecase({required this.productRepo});

  Future<Either<Failure, List<ProductEntity>>> call() async {
    return await productRepo.getFavoriteProducts();
  }
}
