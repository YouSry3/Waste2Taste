import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/database/flutter_secure_storage_service.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/functions/setup_service_locator.dart';
import '../../../../../core/utils/app_router.dart';
import '../../../../../core/utils/custom_snack_bar.dart';
import '../../../../../core/utils/translator.dart';
import '../../../domain/usecases/delete_account_usecase.dart';
import '../../manager/delete_account_cubit/delete_account_cubit.dart';
import 'setting_nav_item.dart';
import 'settings_section.dart';

class DangerSection extends StatelessWidget {
  const DangerSection({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          DeleteAccountCubit(getIt.get<DeleteAccountUsecase>()),
      child: BlocListener<DeleteAccountCubit, DeleteAccountState>(
        listener: (context, state) async {
          if (state is DeleteAccountSuccess) {
            await getIt.get<FlutterSecureStorageService>().clearAuthToken();
            if (context.mounted) {
              CustomSnackBar.show(
                context: context,
                message: context.loc.accountDeletedSuccessfully,
                type: SnackBarType.success,
              );
              AppRouter.logout();
            }
          } else if (state is DeleteAccountFailure) {
            var currentLocal = Localizations.localeOf(context);
            translateMessage(state.errMessage, currentLocal.languageCode).then((
              translatedMessage,
            ) {
              if (context.mounted) {
                CustomSnackBar.show(
                  context: context,
                  message: translatedMessage,
                  type: SnackBarType.info,
                );
              }
            });
          }
        },
        child: Builder(
          builder: (context) {
            return SettingsSection(
              title: context.loc.dangerZone,
              children: [
                SettingsNavItem(
                  icon: LucideIcons.trash2,
                  label: context.loc.deleteAccount,
                  color: Colors.red,
                  onTap: () {
                    _showDeleteConfirmationDialog(context);
                  },
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  void _showDeleteConfirmationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: Text(context.loc.deleteAccount),
          content: Text(context.loc.deleteAccountConfirmation),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: Text(context.loc.cancel),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(dialogContext);
                context.read<DeleteAccountCubit>().deleteAccount();
              },
              child: Text(
                context.loc.delete,
                style: const TextStyle(color: Colors.red),
              ),
            ),
          ],
        );
      },
    );
  }
}
