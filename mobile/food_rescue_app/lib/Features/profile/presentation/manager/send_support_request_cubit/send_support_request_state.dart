abstract class SendSupportRequestState {}

class SendSupportRequestInitial extends SendSupportRequestState {}

class SendSupportRequestLoading extends SendSupportRequestState {}

class SendSupportRequestSuccess extends SendSupportRequestState {}

class SendSupportRequestFailure extends SendSupportRequestState {
  final String errorMessage;
  SendSupportRequestFailure(this.errorMessage);
}
