import 'package:bloc_test/bloc_test.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:waste2taste/Features/orders/data/models/reserve_order_request_model.dart';
import 'package:waste2taste/Features/orders/data/models/reserve_order_response_model.dart';
import 'package:waste2taste/Features/orders/domain/use_cases/reserve_order_usecase.dart';
import 'package:waste2taste/Features/orders/presentation/manager/reserve_order_cubit/reserve_order_cubit.dart';
import 'package:waste2taste/Features/orders/presentation/manager/reserve_order_cubit/reserve_order_state.dart';
import 'package:waste2taste/core/errors/failure.dart';

class MockReserveOrderUseCase extends Mock implements ReserveOrderUseCase {}

void main() {
  late MockReserveOrderUseCase mockUseCase;
  final requestModel = ReserveOrderRequestModel(productId: 'prod-123', pickupTime: '2023-10-15T14:30:00Z');
  final responseModel = ReserveOrderResponseModel(
    id: '1',
    totalPrice: 10.0,
    status: 'pending',
    createdAt: '2023-10-15',
    pickupTime: '2023-10-15T14:30:00Z',
    productName: 'Product',
  );

  setUp(() {
    mockUseCase = MockReserveOrderUseCase();
  });

  group('ReserveOrderCubit tests', () {
    test('initial state should be ReserveOrderInitial', () {
      expect(ReserveOrderCubit(reserveOrderUseCase: mockUseCase).state, isA<ReserveOrderInitial>());
    });

    blocTest<ReserveOrderCubit, ReserveOrderState>(
      'should emit [ReserveOrderLoading, ReserveOrderSuccess] on success',
      build: () {
        when(() => mockUseCase.call(requestModel)).thenAnswer((_) async => Right(responseModel));
        return ReserveOrderCubit(reserveOrderUseCase: mockUseCase);
      },
      act: (cubit) => cubit.reserveOrder(requestModel),
      expect: () => [
        isA<ReserveOrderLoading>(),
        isA<ReserveOrderSuccess>().having((s) => s.response, 'response', responseModel),
      ],
      verify: (_) {
        verify(() => mockUseCase.call(requestModel)).called(1);
      },
    );

    blocTest<ReserveOrderCubit, ReserveOrderState>(
      'should emit [ReserveOrderLoading, ReserveOrderFailure] on failure',
      build: () {
        when(() => mockUseCase.call(requestModel)).thenAnswer(
          (_) async => const Left(ServerFailure(errorMessage: 'Reservation Failed')),
        );
        return ReserveOrderCubit(reserveOrderUseCase: mockUseCase);
      },
      act: (cubit) => cubit.reserveOrder(requestModel),
      expect: () => [
        isA<ReserveOrderLoading>(),
        isA<ReserveOrderFailure>().having((s) => s.errorMessage, 'errorMessage', 'Reservation Failed'),
      ],
      verify: (_) {
        verify(() => mockUseCase.call(requestModel)).called(1);
      },
    );
  });
}
