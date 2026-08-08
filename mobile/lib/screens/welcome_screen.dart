import 'package:flutter/material.dart';

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  final _controller = PageController();
  int _page = 0;

  static const _slides = [
    _WelcomeSlide(
      eyebrow: 'ONE SMART WORKSPACE',
      title: 'Your business, always in focus.',
      description: 'Control sales, inventory, expenses and your team from one beautiful mobile workspace.',
      icon: Icons.auto_graph_rounded,
      colors: [Color(0xFF22D3EE), Color(0xFF2563EB)],
      stats: [('Revenue', '+18.4%'), ('Orders', '3,906'), ('Tasks', '94%')],
    ),
    _WelcomeSlide(
      eyebrow: 'AI BUSINESS COPILOT',
      title: 'Ask. Understand. Act faster.',
      description: 'Turn live company data and documents into clear answers, alerts and recommendations.',
      icon: Icons.auto_awesome_rounded,
      colors: [Color(0xFFA78BFA), Color(0xFF6D28D9)],
      stats: [('Insights', 'Live'), ('Reports', 'Instant'), ('Sources', 'Cited')],
    ),
    _WelcomeSlide(
      eyebrow: 'BUILT FOR YOUR TEAM',
      title: 'The right view for every role.',
      description: 'Owners see the whole operation. Managers stay in control. Employees finish assigned work.',
      icon: Icons.groups_2_rounded,
      colors: [Color(0xFF34D399), Color(0xFF0F766E)],
      stats: [('Owner', '360°'), ('Manager', 'Control'), ('Staff', 'Focused')],
    ),
  ];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07111F),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(22, 18, 22, 4),
              child: Row(
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [Color(0xFF22D3EE), Color(0xFF2563EB)]),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(Icons.layers_rounded, color: Colors.white, size: 22),
                  ),
                  const SizedBox(width: 11),
                  const Text('SmartERP', style: TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.w800, letterSpacing: -.4)),
                  const Text(' AI', style: TextStyle(color: Color(0xFF67E8F9), fontSize: 19, fontWeight: FontWeight.w800)),
                  const Spacer(),
                  TextButton(
                    onPressed: () => Navigator.pushNamed(context, '/login'),
                    child: const Text('Skip', style: TextStyle(color: Color(0xFF94A3B8), fontWeight: FontWeight.w700)),
                  ),
                ],
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: _slides.length,
                onPageChanged: (value) => setState(() => _page = value),
                itemBuilder: (_, index) => _SlideView(slide: _slides[index]),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(22, 8, 22, 22),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(_slides.length, (index) => AnimatedContainer(
                      duration: const Duration(milliseconds: 250),
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      width: _page == index ? 26 : 7,
                      height: 7,
                      decoration: BoxDecoration(color: _page == index ? const Color(0xFF22D3EE) : const Color(0xFF334155), borderRadius: BorderRadius.circular(20)),
                    )),
                  ),
                  const SizedBox(height: 22),
                  FilledButton(
                    onPressed: () {
                      if (_page < _slides.length - 1) {
                        _controller.nextPage(duration: const Duration(milliseconds: 420), curve: Curves.easeOutCubic);
                      } else {
                        Navigator.pushNamed(context, '/login');
                      }
                    },
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFF22D3EE),
                      foregroundColor: const Color(0xFF07111F),
                      padding: const EdgeInsets.symmetric(vertical: 17),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(17)),
                    ),
                    child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [Text(_page == _slides.length - 1 ? 'Sign in to SmartERP' : 'Continue', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)), const SizedBox(width: 8), const Icon(Icons.arrow_forward_rounded, size: 19)]),
                  ),
                  const SizedBox(height: 10),
                  OutlinedButton(
                    onPressed: () => Navigator.pushNamed(context, '/register'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      side: const BorderSide(color: Color(0xFF334155)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(17)),
                    ),
                    child: const Text('Create a business account', style: TextStyle(fontWeight: FontWeight.w700)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SlideView extends StatelessWidget {
  final _WelcomeSlide slide;
  const _SlideView({required this.slide});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(22, 14, 22, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [slide.colors.first.withValues(alpha: .18), const Color(0xFF0C1728), slide.colors.last.withValues(alpha: .14)]),
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: Colors.white.withValues(alpha: .08)),
              ),
              child: Stack(
                children: [
                  Positioned(right: -45, top: -45, child: Container(width: 190, height: 190, decoration: BoxDecoration(shape: BoxShape.circle, color: slide.colors.first.withValues(alpha: .09)))),
                  Padding(
                    padding: const EdgeInsets.all(26),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(padding: const EdgeInsets.all(15), decoration: BoxDecoration(gradient: LinearGradient(colors: slide.colors), borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: slide.colors.last.withValues(alpha: .3), blurRadius: 24)]), child: Icon(slide.icon, color: Colors.white, size: 30)),
                        const Spacer(),
                        Row(children: slide.stats.map((stat) => Expanded(child: Container(margin: const EdgeInsets.only(right: 7), padding: const EdgeInsets.all(11), decoration: BoxDecoration(color: Colors.white.withValues(alpha: .05), borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.white.withValues(alpha: .06))), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(stat.$1, style: const TextStyle(color: Color(0xFF64748B), fontSize: 9, fontWeight: FontWeight.w700)), const SizedBox(height: 5), Text(stat.$2, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w800))])))).toList()),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 28),
          Text(slide.eyebrow, style: TextStyle(color: slide.colors.first, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.5)),
          const SizedBox(height: 9),
          Text(slide.title, style: const TextStyle(color: Colors.white, height: 1.08, fontSize: 34, fontWeight: FontWeight.w800, letterSpacing: -1.1)),
          const SizedBox(height: 12),
          Text(slide.description, style: const TextStyle(color: Color(0xFF94A3B8), height: 1.5, fontSize: 14)),
        ],
      ),
    );
  }
}

class _WelcomeSlide {
  final String eyebrow;
  final String title;
  final String description;
  final IconData icon;
  final List<Color> colors;
  final List<(String, String)> stats;
  const _WelcomeSlide({required this.eyebrow, required this.title, required this.description, required this.icon, required this.colors, required this.stats});
}
