import 'package:flutter/material.dart';
import 'package:waste2taste/core/constants/app_colors.dart';
import 'package:waste2taste/core/constants/app_text_styles.dart';
import 'package:waste2taste/core/extensions/app_localization_extention.dart';

class DistanceOffersSheet extends StatefulWidget {
  final double initialDistance;

  const DistanceOffersSheet({super.key, required this.initialDistance});

  @override
  State<DistanceOffersSheet> createState() => _DistanceOffersSheetState();
}

class _DistanceOffersSheetState extends State<DistanceOffersSheet> {
  late double _currentDistance;

  @override
  void initState() {
    super.initState();
    _currentDistance = widget.initialDistance;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 45,
            height: 5,
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(20),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            context.loc.maxDistance,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.onSurface,
                ),
          ),
          const SizedBox(height: 24),
          Slider(
            value: _currentDistance,
            min: 1,
            max: 100,
            divisions: 99,
            activeColor: AppColors.primary,
            label: _currentDistance >= 100 ? 'None' : '${_currentDistance.round()} km',
            onChanged: (value) {
              setState(() {
                _currentDistance = value;
              });
            },
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('1 km', style: AppTextStyles.body(context)),
                Text(
                  _currentDistance >= 100 ? 'None' : '${_currentDistance.round()} km',
                  style: AppTextStyles.body(context).copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
                Text('None', style: AppTextStyles.body(context)),
              ],
            ),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context, _currentDistance);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Text(
                context.loc.apply,
                style: AppTextStyles.label(context).copyWith(color: Colors.white),
              ),
            ),
          ),
          const SizedBox(height: 12),
        ],
      ),
    );
  }
}
