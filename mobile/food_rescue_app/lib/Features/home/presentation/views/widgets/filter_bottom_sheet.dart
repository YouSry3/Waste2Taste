import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/Features/home/presentation/manager/filter_cubit/filter_cubit.dart';
import 'package:waste2taste/core/constants/app_colors.dart';
import 'package:waste2taste/core/constants/app_text_styles.dart';
import 'package:waste2taste/core/extensions/app_localization_extention.dart';

class FilterBottomSheet extends StatelessWidget {
  const FilterBottomSheet({
    super.key,
    this.initialMaxPrice,
    this.initialMaxDistance,
  });

  final double? initialMaxPrice;
  final double? initialMaxDistance;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => FilterCubit(
        initialMaxPrice: initialMaxPrice,
        initialMaxDistance: initialMaxDistance,
      ),
      child: BlocBuilder<FilterCubit, FilterState>(
        builder: (context, state) {
          final cubit = context.read<FilterCubit>();
          return Container(
            padding: const EdgeInsets.all(24),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      context.loc.filter,
                      style: AppTextStyles.label(context),
                    ),
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.close),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Text(context.loc.maxPrice, style: AppTextStyles.label(context)),
                Slider(
                  value: state.maxPrice,
                  max: 100,
                  divisions: 20,
                  activeColor: AppColors.primary,
                  label: '${state.maxPrice.round()} \$',
                  onChanged: (value) => cubit.updateMaxPrice(value),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('0 \$'),
                    Text('${state.maxPrice.round()} \$'),
                  ],
                ),
                const SizedBox(height: 32),
                Text(
                  context.loc.maxDistance,
                  style: AppTextStyles.label(context),
                ),
                Slider(
                  value: state.maxDistance,
                  max: 100,
                  divisions: 20,
                  activeColor: AppColors.primary,
                  label: '${state.maxDistance.round()} km',
                  onChanged: (value) => cubit.updateMaxDistance(value),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('0 km'),
                    Text('${state.maxDistance.round()} km'),
                  ],
                ),
                const SizedBox(height: 40),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context, {
                        'maxPrice': state.maxPrice,
                        'maxDistance': state.maxDistance,
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: Text(
                      context.loc.apply,
                      style: AppTextStyles.label(
                        context,
                      ).copyWith(color: Colors.white),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          );
        },
      ),
    );
  }
}
