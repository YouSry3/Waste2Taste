import 'package:flutter/material.dart';
import 'filter_button.dart';
import 'search_bar_shell.dart';
import 'search_leading_icon.dart';
import 'search_text_filed.dart';

class HomeSearchBar extends StatelessWidget {
  const HomeSearchBar({super.key});

  @override
  Widget build(BuildContext context) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: SearchBarShell(
          child: Row(
            children: [
              const SearchLeadingIcon(),
              const SizedBox(width: 16),
              Expanded(child: SearchTextField()),
              const VerticalDivider(endIndent: 12, indent: 12, thickness: 1.5),
              const FilterButton(),
            ],
          ),
        ),
      ),
    );
  }
}
