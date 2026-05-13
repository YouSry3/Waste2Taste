part of 'toggle_favorite_cubit.dart';

abstract class ToggleFavoriteState {
  final bool isFavorite;
  ToggleFavoriteState({this.isFavorite = false});
}

class ToggleFavoriteInitial extends ToggleFavoriteState {
  ToggleFavoriteInitial({super.isFavorite});
}

class ToggleFavoriteLoading extends ToggleFavoriteState {
  ToggleFavoriteLoading({required super.isFavorite});
}

class ToggleFavoriteSuccess extends ToggleFavoriteState {
  ToggleFavoriteSuccess({required super.isFavorite});
}

class ToggleFavoriteFailure extends ToggleFavoriteState {
  final String errMessage;
  ToggleFavoriteFailure({required this.errMessage, required super.isFavorite});
}
