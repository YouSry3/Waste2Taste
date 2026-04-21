import 'package:flutter/material.dart';

class LanguageSheetCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String emoji;
  final bool isSelected;
  final VoidCallback onTap;

  const LanguageSheetCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.emoji,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            color: isSelected
                ? Theme.of(context).colorScheme.primary.withValues(alpha: 0.08)
                : Theme.of(context).colorScheme.surface,
            border: Border.all(
              color: isSelected
                  ? Theme.of(context).colorScheme.primary
                  : Colors.grey.withValues(alpha: 0.2),
              width: isSelected ? 1.4 : 1,
            ),
            boxShadow: [
              if (isSelected)
                BoxShadow(
                  color: Theme.of(
                    context,
                  ).colorScheme.primary.withValues(alpha: 0.15),
                  blurRadius: 12,
                  offset: const Offset(0, 6),
                ),
            ],
          ),
          child: Row(
            children: [
              Text(emoji, style: const TextStyle(fontSize: 26)),

              const SizedBox(width: 12),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),

              AnimatedSwitcher(
                duration: const Duration(milliseconds: 200),
                child: isSelected
                    ? Icon(
                        Icons.check_circle,
                        key: const ValueKey(true),
                        color: Theme.of(context).colorScheme.primary,
                      )
                    : const Icon(
                        Icons.circle_outlined,
                        key: ValueKey(false),
                        color: Colors.grey,
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
