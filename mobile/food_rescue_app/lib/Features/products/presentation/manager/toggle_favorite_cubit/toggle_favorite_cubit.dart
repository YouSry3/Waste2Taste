import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/Features/products/domain/use_cases/toggle_favorite_usecase.dart';

part 'toggle_favorite_state.dart';

class ToggleFavoriteCubit extends Cubit<ToggleFavoriteState> {
  ToggleFavoriteCubit(this.toggleFavoriteUsecase) : super(ToggleFavoriteInitial());

  final ToggleFavoriteUsecase toggleFavoriteUsecase;

  Future<void> toggleFavorite({required String productId, required bool currentStatus}) async {
    emit(ToggleFavoriteLoading(isFavorite: !currentStatus));
    
    var result = await toggleFavoriteUsecase.call(productId);
    
    result.fold(
      (failure) => emit(ToggleFavoriteFailure(
        errMessage: failure.errorMessage,
        isFavorite: currentStatus,
      )),
      (success) => emit(ToggleFavoriteSuccess(isFavorite: !currentStatus)),
    );
  }
}
