import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_products_cubit/get_products_cubit.dart';
import 'package:waste2taste/core/constants/app_colors.dart';
import 'package:waste2taste/core/extensions/app_localization_extention.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';
import 'package:waste2taste/core/utils/custom_snack_bar.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import '../../../../products/presentation/manager/toggle_favorite_cubit/toggle_favorite_cubit.dart';
import 'circle_icon_button.dart';

class ToggleFavouriteBlocConsumer extends StatelessWidget {
  const ToggleFavouriteBlocConsumer({super.key, required this.product});

  final ProductEntity product;

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<ToggleFavoriteCubit, ToggleFavoriteState>(
      listener: (context, state) {
        if (state is ToggleFavoriteFailure) {
          CustomSnackBar.show(
            context: context,
            message: state.errMessage,
            type: SnackBarType.error,
          );
        } else if (state is ToggleFavoriteSuccess) {
          getIt<GetProductsCubit>().updateProductFavorite(
            product.id,
            state.isFavorite,
          );
          CustomSnackBar.show(
            context: context,
            message: state.isFavorite
                ? context.loc.addedToFavorites
                : context.loc.removedFromFavorites,
            type: SnackBarType.success,
          );
        }
      },
      builder: (context, state) {
        final bool isFavorite = (state is ToggleFavoriteInitial)
            ? product.isFavorite
            : state.isFavorite;
        return CircleIconButton(
          icon: isFavorite ? Icons.favorite : Icons.favorite_border,
          color: isFavorite ? AppColors.accent : AppColors.textGrayDark,
          onPressed: () {
            if (state is! ToggleFavoriteLoading) {
              context.read<ToggleFavoriteCubit>().toggleFavorite(
                productId: product.id,
                currentStatus: isFavorite,
              );
            }
          },
        );
      },
    );
  }
}
