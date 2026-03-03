import 'package:flutter/material.dart';
import '../../../data/models/profile_menu_item_model.dart';
import 'profile_item.dart';

class ProfileMenuSection extends StatelessWidget {
  final List<ProfileMenuItemModel> items;

  const ProfileMenuSection({super.key, required this.items});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(
            color: Color(0x05000000),
            blurRadius: 15,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: ListView.separated(
        shrinkWrap: true,
        itemCount: items.length,
        physics: const NeverScrollableScrollPhysics(),
        separatorBuilder: (_, _) => const Divider(
          height: 1,
          thickness: 1,
          indent: 72,
          color: Color(0x0D000000),
        ),
        itemBuilder: (context, index) {
          final item = items[index];
          return ProfileItem(item: item);
        },
      ),
    );
  }
}
