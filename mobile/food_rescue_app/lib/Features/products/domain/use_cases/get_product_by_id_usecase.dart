import 'package:dartz/dartz.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'package:waste2taste/Features/products/domain/repos/product_repo.dart';
import 'package:waste2taste/core/errors/failure.dart';
import 'package:waste2taste/core/usecase/use_case.dart';

class GetProductByIdUsecase extends UseCase<ProductEntity, String> {
  final ProductRepo productRepo;

  GetProductByIdUsecase(this.productRepo);

  @override
  Future<Either<Failure, ProductEntity>> call(String param) {
    return productRepo.getProductById(param);
  }
}
