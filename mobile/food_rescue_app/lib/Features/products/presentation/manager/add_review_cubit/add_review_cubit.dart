import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/Features/products/data/models/add_review_model.dart';
import 'package:waste2taste/Features/products/domain/use_cases/add_review_usecase.dart';
import 'add_review_state.dart';

class AddReviewCubit extends Cubit<AddReviewState> {
  final AddReviewUseCase addReviewUseCase;

  AddReviewCubit({required this.addReviewUseCase}) : super(AddReviewInitial());

  Future<void> addReview(AddReviewModel review) async {
    emit(AddReviewLoading());
    final result = await addReviewUseCase.call(review);
    result.fold(
      (failure) => emit(AddReviewFailure(failure.errorMessage)),
      (response) => emit(AddReviewSuccess(response)),
    );
  }
}
