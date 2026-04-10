import 'package:flutter/material.dart';
import '../../Features/home/presentation/views/home_view.dart';
import '../../Features/map/presentation/views/map_view.dart';
import '../../Features/orders/presentation/views/orders_view.dart';
import '../../Features/profile/presentation/views/profile_view.dart';
import 'custom_nav_bar.dart';

class CustomBottomNavigationBar extends StatefulWidget {
  const CustomBottomNavigationBar({super.key});

  @override
  State<CustomBottomNavigationBar> createState() =>
      _CustomBottomNavigationBarState();
}

class _CustomBottomNavigationBarState extends State<CustomBottomNavigationBar> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    const HomeView(),
    const MapView(),
    const OrdersView(),
    const ProfileView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _currentIndex, children: _pages),
      bottomNavigationBar: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 500),
        child: CustomNavBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
        ),
      ),
    );
  }
}
