import 'package:flutter/material.dart';

import '../../../../../core/extensions/app_localization_extention.dart';

class SearchTextField extends StatelessWidget {
  const SearchTextField({super.key});

  void _onSearchSubmitted(BuildContext context, String query) {
    if (query.isEmpty) return;
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      textInputAction: TextInputAction.search,
      onSubmitted: (query) => _onSearchSubmitted(context, query),
      decoration: InputDecoration(
        hintText: context.loc.searchfood,
        hintStyle: TextStyle(color: Colors.grey[400], fontSize: 16),
        border: InputBorder.none,
        contentPadding: EdgeInsets.zero,
      ),
    );
  }
}
