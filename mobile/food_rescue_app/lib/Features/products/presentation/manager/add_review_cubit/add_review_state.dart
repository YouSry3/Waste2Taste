import 'package:waste2taste/Features/products/data/models/add_review_response_model.dart';

abstract class AddReviewState {}

class AddReviewInitial extends AddReviewState {}

class AddReviewLoading extends AddReviewState {}

class AddReviewSuccess extends AddReviewState {
  final AddReviewResponseModel response;
  AddReviewSuccess(this.response);
}

class AddReviewFailure extends AddReviewState {
  final String errorMessage;
  AddReviewFailure(this.errorMessage);
}
