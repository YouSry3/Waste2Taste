import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:waste2taste/core/usecase/use_case.dart';
import '../../../domain/usecases/delete_account_usecase.dart';

part 'delete_account_state.dart';

class DeleteAccountCubit extends Cubit<DeleteAccountState> {
  DeleteAccountCubit(this.deleteAccountUsecase) : super(DeleteAccountInitial());
  final DeleteAccountUsecase deleteAccountUsecase;

  Future<void> deleteAccount() async {
    emit(DeleteAccountLoading());
    var result = await deleteAccountUsecase.call(NoParamImpl());
    result.fold(
      (failure) => emit(DeleteAccountFailure(errMessage: failure.errorMessage)),
      (success) => emit(DeleteAccountSuccess()),
    );
  }
}
