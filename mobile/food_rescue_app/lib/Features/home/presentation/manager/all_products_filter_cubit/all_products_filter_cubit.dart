import 'package:flutter_bloc/flutter_bloc.dart';

class AllProductsFilterState {
  final String searchQuery;
  final double maxPrice;
  final double maxDistance;
  final bool anyDataChanged;

  AllProductsFilterState({
    required this.searchQuery,
    required this.maxPrice,
    required this.maxDistance,
    required this.anyDataChanged,
  });

  AllProductsFilterState copyWith({
    String? searchQuery,
    double? maxPrice,
    double? maxDistance,
    bool? anyDataChanged,
  }) {
    return AllProductsFilterState(
      searchQuery: searchQuery ?? this.searchQuery,
      maxPrice: maxPrice ?? this.maxPrice,
      maxDistance: maxDistance ?? this.maxDistance,
      anyDataChanged: anyDataChanged ?? this.anyDataChanged,
    );
  }
}

class AllProductsFilterCubit extends Cubit<AllProductsFilterState> {
  AllProductsFilterCubit()
      : super(AllProductsFilterState(
          searchQuery: '',
          maxPrice: 100,
          maxDistance: 100,
          anyDataChanged: false,
        ));

  void updateSearchQuery(String query) {
    emit(state.copyWith(searchQuery: query));
  }

  void updateFilters(double price, double distance) {
    emit(state.copyWith(maxPrice: price, maxDistance: distance));
  }

  void setDataChanged(bool changed) {
    emit(state.copyWith(anyDataChanged: changed));
  }
}
