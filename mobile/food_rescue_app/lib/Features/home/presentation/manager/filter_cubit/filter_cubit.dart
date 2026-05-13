import 'package:flutter_bloc/flutter_bloc.dart';

class FilterState {
  final double maxPrice;
  final double maxDistance;

  FilterState({required this.maxPrice, required this.maxDistance});

  FilterState copyWith({double? maxPrice, double? maxDistance}) {
    return FilterState(
      maxPrice: maxPrice ?? this.maxPrice,
      maxDistance: maxDistance ?? this.maxDistance,
    );
  }
}

class FilterCubit extends Cubit<FilterState> {
  FilterCubit({double? initialMaxPrice, double? initialMaxDistance})
      : super(FilterState(
          maxPrice: initialMaxPrice ?? 100,
          maxDistance: initialMaxDistance ?? 100,
        ));

  void updateMaxPrice(double value) {
    emit(state.copyWith(maxPrice: value));
  }

  void updateMaxDistance(double value) {
    emit(state.copyWith(maxDistance: value));
  }
}
