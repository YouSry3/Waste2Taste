import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:load_it/load_it.dart';
import '../../../../../../core/constants/app_colors.dart';
import '../../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../../core/utils/custom_snack_bar.dart';
import '../../../../../../core/widgets/custom_elevated_button.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/utils/app_routes.dart';
import '../../../../home/domain/entities/product_entity.dart';
import '../../../../orders/data/models/reserve_order_request_model.dart';
import '../../../../orders/presentation/manager/reserve_order_cubit/reserve_order_cubit.dart';
import '../../../../orders/presentation/manager/reserve_order_cubit/reserve_order_state.dart';
import '../../../../../../core/functions/setup_service_locator.dart';
import '../../../../orders/presentation/manager/get_my_orders_cubit/get_my_orders_cubit.dart';

class ReserveButtonBlocConsumer extends StatelessWidget {
  const ReserveButtonBlocConsumer({super.key, required this.product});

  final ProductEntity product;

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<ReserveOrderCubit, ReserveOrderState>(
      listener: (context, state) {
        if (state is ReserveOrderSuccess) {
          getIt.get<GetMyOrdersCubit>().getMyOrders();
          GoRouter.of(context).push(
            AppRoutes.orderConfirmationView,
            extra: {
              'response': state.response,
              'product': product,
            },
          );
        } else if (state is ReserveOrderFailure) {
          CustomSnackBar.show(
            context: context,
            message: state.errorMessage,
            type: SnackBarType.error,
          );
        }
      },
      builder: (context, state) {
        return CustomElevatedButton(
          bgColor: AppColors.secondary,
          onPressed: state is ReserveOrderLoading
              ? null
              : () {
                  final requestModel = ReserveOrderRequestModel(
                    productId: product.id,
                    pickupTime: DateTime.now()
                        .add(const Duration(hours: 3))
                        .toUtc()
                        .toIso8601String(),
                  );
                  context.read<ReserveOrderCubit>().reserveOrder(
                    requestModel,
                  );
                },
          child: state is ReserveOrderLoading
              ? const BouncingDotsIndicator(color: AppColors.background)
              : Text(context.loc.reserveNow, style: AppTextStyles.button),
        );
      },
    );
  }
}