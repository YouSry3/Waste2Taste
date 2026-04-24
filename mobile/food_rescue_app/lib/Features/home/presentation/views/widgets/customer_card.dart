import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/api_urls.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../manager/get_user_location_cubit/get_user_location_cubit.dart';

class CustomerCard extends StatelessWidget {
  const CustomerCard({
    super.key,
    required this.userName,
    required this.profileImageUrl,
  });

  final String userName;
  final String profileImageUrl;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.all(7),
      title: Text(
        context.loc.helloUser(userName),
        style: AppTextStyles.title(
          context,
        ).copyWith(wordSpacing: 2, height: 2, fontSize: 16),
      ),
      subtitle: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(LucideIcons.mapPin, size: 24, color: AppColors.primary),
          const SizedBox(width: 4),
          BlocBuilder<GetUserLocationCubit, GetUserLocationState>(
            builder: (context, locationState) {
              final String location = _mapLocationStateToText(
                context,
                locationState,
              );
              return Text(
                location,
                style: AppTextStyles.subtitle(
                  context,
                ).copyWith(wordSpacing: 2, fontSize: 16),
              );
            },
          ),
        ],
      ),
      trailing: CircleAvatar(
        radius: 24,
        child: CircleAvatar(
          radius: 22,
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          child: ClipOval(
            child: CachedNetworkImage(
              width: 44,
              height: 44,
              fit: BoxFit.cover,
              imageUrl: ApiUrls.baseUrl + profileImageUrl,
              errorWidget: (context, url, error) =>
                  const Icon(Icons.person, color: AppColors.primary),
            ),
          ),
        ),
      ),
    );
  }

  String _mapLocationStateToText(
    BuildContext context,
    GetUserLocationState state,
  ) {
    if (state is GetUserLocationSuccessState) {
      final lang = Localizations.localeOf(context).languageCode;
      return lang == 'en'
          ? state.locationEntity.addressEn
          : state.locationEntity.addressAr;
    } else if (state is GetUserLocationFailureState) {
      return 'Location unavailable';
    } else {
      return 'Locating...';
    }
  }
}
