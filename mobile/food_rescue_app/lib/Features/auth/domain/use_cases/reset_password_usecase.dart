import 'package:dartz/dartz.dart';
import 'package:waste2taste/Features/auth/domain/repos/auth_repo.dart';
import 'package:waste2taste/core/errors/failure.dart';
import 'package:waste2taste/core/usecase/use_case.dart';

class ResetPasswordUsecase extends UseCase<void, String> {
  final AuthRepo authRepo;

  ResetPasswordUsecase({required this.authRepo});
  @override
  Future<Either<Failure, void>> call(String param) async {
    return await authRepo.resetPassword(email: param);
  }
}
