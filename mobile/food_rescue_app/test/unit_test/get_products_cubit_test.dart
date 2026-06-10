import 'package:bloc_test/bloc_test.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'package:waste2taste/Features/home/domain/use_cases/get_products_usecase.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_products_cubit/get_products_cubit.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_products_cubit/get_products_state.dart';
import 'package:waste2taste/core/errors/failure.dart';

class MockGetProductsUsecase extends Mock implements GetProductsUsecase {}

void main() {
  late MockGetProductsUsecase mockUsecase;
  late List<ProductEntity> fakeProducts;

  setUp(() {
    mockUsecase = MockGetProductsUsecase();
    fakeProducts = [
      const ProductEntity(
        id: '1',
        name: 'Product 1',
        imageUrl: '',
        price: 10.0,
        originalPrice: 20.0,
        discountPercentage: 50,
        expiresIn: '2h',
        rating: 4.5,
        vendorName: 'Vendor 1',
        latitude: 30.0,
        longitude: 31.0,
        vendorId: 'v1',
        description: 'Desc 1',
        totalReviews: 10,
        isFavorite: false,
        quantity: 5,
      ),
      const ProductEntity(
        id: '2',
        name: 'Product 2',
        imageUrl: '',
        price: 15.0,
        originalPrice: 30.0,
        discountPercentage: 50,
        expiresIn: '3h',
        rating: 4.0,
        vendorName: 'Vendor 2',
        latitude: 30.1,
        longitude: 31.1,
        vendorId: 'v2',
        description: 'Desc 2',
        totalReviews: 5,
        isFavorite: true,
        quantity: 2,
      ),
    ];
  });

  group('GetProductsCubit tests', () {
    test('initial state should be GetProductsInitialState', () {
      expect(GetProductsCubit(mockUsecase).state, isA<GetProductsInitialState>());
    });

    blocTest<GetProductsCubit, GetProductsState>(
      'should emit [GetProductsLoadingState, GetProductsSuccessState] on fetch success',
      build: () {
        when(() => mockUsecase.call()).thenAnswer((_) async => Right(fakeProducts));
        return GetProductsCubit(mockUsecase);
      },
      act: (cubit) => cubit.getProducts(),
      expect: () => [
        isA<GetProductsLoadingState>(),
        isA<GetProductsSuccessState>().having((s) => s.data, 'data', fakeProducts),
      ],
    );

    blocTest<GetProductsCubit, GetProductsState>(
      'should emit [GetProductsLoadingState, GetProductsFailureState] on fetch failure',
      build: () {
        when(() => mockUsecase.call()).thenAnswer(
          (_) async => const Left(ServerFailure(errorMessage: 'Error loading products')),
        );
        return GetProductsCubit(mockUsecase);
      },
      act: (cubit) => cubit.getProducts(),
      expect: () => [
        isA<GetProductsLoadingState>(),
        isA<GetProductsFailureState>().having((s) => s.errMessage, 'errMessage', 'Error loading products'),
      ],
    );

    group('Favorites manipulation tests', () {
      late GetProductsCubit cubit;

      setUp(() {
        cubit = GetProductsCubit(mockUsecase);
      });

      test('isProductFavorite should return correct favorite state or throw if not found', () {
        // Mock state as success
        cubit.emit(GetProductsSuccessState(data: fakeProducts));

        expect(cubit.isProductFavorite('1'), isFalse);
        expect(cubit.isProductFavorite('2'), isTrue);
        expect(() => cubit.isProductFavorite('non-existent'), throwsException);
      });

      test('isProductFavorite should return false if state is not GetProductsSuccessState', () {
        expect(cubit.isProductFavorite('1'), isFalse);
      });

      blocTest<GetProductsCubit, GetProductsState>(
        'updateProductFavorite should emit new Success state with updated list',
        build: () => cubit,
        seed: () => GetProductsSuccessState(data: fakeProducts),
        act: (cubit) => cubit.updateProductFavorite('1', true),
        expect: () => [
          isA<GetProductsSuccessState>().having(
            (s) => s.data.firstWhere((p) => p.id == '1').isFavorite,
            'product 1 favorite',
            true,
          ),
        ],
      );

      blocTest<GetProductsCubit, GetProductsState>(
        'updateProductFavorite should do nothing if state is not Success',
        build: () => cubit,
        act: (cubit) => cubit.updateProductFavorite('1', true),
        expect: () => [],
      );
    });
  });
}
