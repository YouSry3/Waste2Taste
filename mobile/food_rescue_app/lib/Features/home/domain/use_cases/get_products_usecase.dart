import 'package:dartz/dartz.dart';
import '../../../../core/errors/failure.dart';
import '../../../../core/usecase/use_case.dart';
import '../entities/product_entity.dart';
import '../repos/home_repo.dart';

class GetProductsUsecase extends UseCase<List<ProductEntity>, NoParam> {
  GetProductsUsecase({required this.homeRepo});
  final HomeRepo homeRepo;

  @override
  Future<Either<Failure, List<ProductEntity>>> call([NoParam? param]) async =>
      await homeRepo.getProducts();
}
