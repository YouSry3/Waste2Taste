import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../data/models/support_request_model.dart';
import '../../../domain/usecases/send_support_request_usecase.dart';
import 'send_support_request_state.dart';

class SendSupportRequestCubit extends Cubit<SendSupportRequestState> {
  final SendSupportRequestUsecase sendSupportRequestUsecase;

  SendSupportRequestCubit(this.sendSupportRequestUsecase)
      : super(SendSupportRequestInitial());

  Future<void> sendSupportRequest({
    required String subject,
    required String description,
  }) async {
    emit(SendSupportRequestLoading());
    var result = await sendSupportRequestUsecase.call(
      SupportRequestModel(subject: subject, description: description),
    );
    result.fold(
      (failure) => emit(SendSupportRequestFailure(failure.errorMessage)),
      (_) => emit(SendSupportRequestSuccess()),
    );
  }
}
