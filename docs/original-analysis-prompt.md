# AG Grid Benzeri Data Grid Paketi İçin AI Analiz Promptu

Aşağıdaki promptu doğrudan bir yapay zekâ aracına vererek, geliştirici odaklı ve kapsamlı bir teknik analiz ürettirebilirsin.

````text
Sen kıdemli bir frontend mimarı, UI kütüphanesi geliştiricisi ve open-source paket tasarım uzmanısın.

AG Grid benzeri, ancak özellikle kullanım kolaylığı, özelleştirilebilirlik, modern frontend mimarisi ve responsive davranışlar konusunda güçlü olacak bir tablo/grid sistemi geliştirmek istiyorum.

Hazırlayacağın çalışma doğrudan developerlar tarafından kullanılacak kapsamlı bir teknik analiz ve ürün mimarisi dokümanı olmalıdır. Yüzeysel öneriler verme. Teknik kararları, alternatifleri, avantajları, dezavantajları ve olası riskleri açıkça belirt.

## Projenin temel amacı

Modern web uygulamalarında kullanılabilecek, yüksek performanslı, özelleştirilebilir, erişilebilir ve responsive bir data grid/table paketi geliştirilecek.

Paketin aşağıdaki ekranlarda sorunsuz çalışması gerekir:

- Büyük masaüstü ekranlar
- Standart laptop ekranları
- Tablet ekranları
- Mobil ekranlar

En önemli gereksinimlerden biri stil sistemidir. Geliştirici tabloyu özelleştirmek için paketle mücadele etmemelidir. CSS kolayca manipüle edilebilmeli, tema oluşturmak kolay olmalı ve paket stilleri uygulamanın stillerini gereksiz yere ezmemelidir.

## Analizde ele alınması gereken ana başlıklar

### 1. Ürün vizyonu ve kapsam

Aşağıdaki konuları açıkla:

- Bu paketin çözmeyi hedeflediği temel problemler
- Hedef kullanıcı kitlesi
- AG Grid, TanStack Table, MUI Data Grid, Handsontable ve benzeri çözümlerden nasıl ayrışabileceği
- Minimum uygulanabilir ürün, yani MVP kapsamı
- MVP sonrasında eklenebilecek gelişmiş özellikler
- Community ve Pro sürüm ayrımı yapılacaksa hangi özelliklerin hangi sürümde olabileceği
- Projenin headless, styled veya hybrid bir mimariye sahip olup olmaması gerektiği

Önerdiğin yaklaşımın gerekçesini belirt.

### 2. Teknik mimari

Paketin teknik mimarisini ayrıntılı şekilde tasarla.

Şunları değerlendir:

- Core grid engine
- Rendering katmanı
- Framework adapter sistemi
- React adapter
- Vue adapter
- Svelte adapter
- Vanilla JavaScript kullanımı
- State management yaklaşımı
- Plugin sistemi
- Event sistemi
- Feature modülleri
- Column model
- Row model
- Selection model
- Sorting model
- Filtering model
- Pagination model
- Editing model
- Virtualization sistemi
- Keyboard navigation sistemi

Framework bağımsız bir core paket ile framework-specific adapter paketlerinin ayrılması mantıklı mı, değerlendir.

Örnek paket yapısı sun:

- `@project/grid-core`
- `@project/grid-react`
- `@project/grid-vue`
- `@project/grid-svelte`
- `@project/grid-theme`
- `@project/grid-plugins`

Monorepo kullanılıp kullanılmaması gerektiğini değerlendir. Turborepo, Nx veya pnpm workspace seçeneklerini karşılaştır.

### 3. API tasarımı

Developer experience odaklı bir API tasarla.

Şunlar için öneriler ve TypeScript örnekleri ver:

- Grid oluşturma
- Column definition
- Row data
- Sorting
- Filtering
- Pagination
- Row selection
- Cell selection
- Inline editing
- Custom cell renderer
- Custom header renderer
- Row actions
- Column resizing
- Column reordering
- Column visibility
- Column pinning
- Grouping
- Aggregation
- Export
- Server-side data loading
- Infinite scrolling
- Controlled ve uncontrolled kullanım

API aşağıdaki özelliklere sahip olmalıdır:

- Type-safe
- Kolay öğrenilebilir
- Tutarlı isimlendirme
- Minimum boilerplate
- Genişletilebilir
- Framework bağımlılığı düşük
- Tree-shaking ile uyumlu
- Geriye dönük uyumluluğu yönetilebilir

Generic TypeScript yapıları kullanarak örnekler ver.

Örneğin row tipinden column key'lerinin otomatik çıkarılması, cell renderer parametrelerinin doğru tiplenmesi ve event payload'larının type-safe olması gibi konuları analiz et.

### 4. CSS ve stil mimarisi

Bu bölüm analizin en kapsamlı bölümlerinden biri olmalıdır.

Temel hedef şudur:

Geliştirici grid paketinin CSS yapısıyla mücadele etmemeli, stilleri kolayca değiştirebilmeli ve tema oluşturabilmelidir.

Aşağıdaki stil yaklaşımlarını karşılaştır:

- Plain CSS
- CSS Modules
- CSS-in-JS
- Shadow DOM
- Web Components style encapsulation
- Utility class yaklaşımı
- Tailwind uyumluluğu
- Headless component yaklaşımı
- CSS custom properties
- Design token sistemi
- Cascade layers
- CSS parts
- Slot tabanlı className API
- Unstyled mode

Her yaklaşımın avantajlarını ve dezavantajlarını açıkla.

Önerilen stil mimarisi şu özelliklere sahip olmalıdır:

- CSS custom property tabanlı tema sistemi
- Global stilleri minimum düzeyde etkileme
- Düşük selector specificity
- `!important` kullanımını mümkün olduğunca engelleme
- Geliştiricinin kendi `className` değerlerini ekleyebilmesi
- Her önemli grid parçası için class veya slot sunulması
- Component seviyesinde style override desteği
- Row, cell, header ve footer seviyesinde dinamik class desteği
- State bazlı data attribute kullanımı
- Dark mode desteği
- High contrast mode desteği
- CSS reset zorunluluğu oluşturmama
- Tailwind, Bootstrap, Material UI ve özel design system'lerle birlikte çalışabilme
- Tema paketlerinin bağımsız yüklenebilmesi
- Varsayılan stil paketinin opsiyonel olması
- Unstyled veya headless kullanım seçeneği

Önerilen DOM ve CSS sözleşmesine örnek ver.

Örnek olarak şu yapılara benzer bir yaklaşımı değerlendir:

- `.grid-root`
- `.grid-header`
- `.grid-header-cell`
- `.grid-body`
- `.grid-row`
- `.grid-cell`
- `.grid-footer`

Ayrıca state bilgisini şu tür data attribute'larla sunmayı değerlendir:

- `data-selected`
- `data-focused`
- `data-editing`
- `data-sort`
- `data-pinned`
- `data-disabled`
- `data-density`
- `data-viewport`

CSS specificity stratejisini açıkça tanımla.

Örneğin `:where()` kullanımı, cascade layer kullanımı ve uygulama stillerinin paket stillerini kolayca geçebilmesi hakkında öneri ver.

Aşağıdaki gibi CSS variable örnekleri oluştur:

- `--grid-font-family`
- `--grid-font-size`
- `--grid-row-height`
- `--grid-header-height`
- `--grid-cell-padding-x`
- `--grid-cell-padding-y`
- `--grid-border-color`
- `--grid-background`
- `--grid-foreground`
- `--grid-header-background`
- `--grid-row-hover-background`
- `--grid-row-selected-background`
- `--grid-focus-ring`
- `--grid-border-radius`
- `--grid-density`

Tema oluşturma örnekleri sun:

- Light theme
- Dark theme
- Compact theme
- Comfortable theme
- Mobile theme

Geliştiricinin tek bir column, cell veya row için stil değiştirebilmesini sağlayacak API öner.

Örneğin aşağıdaki seçenekleri değerlendir:

- `className`
- `headerClassName`
- `cellClassName`
- `rowClassName`
- `getCellClassName`
- `getRowClassName`
- `style`
- `getCellStyle`
- `slots`
- `slotProps`

Inline style kullanımının sınırlarını ve CSS class yaklaşımının avantajlarını açıkla.

### 5. Responsive tasarım

Grid sistemi yalnızca masaüstünde çalışan klasik bir tablo olmamalıdır.

Büyük ekran, tablet ve mobil cihazlarda kullanılabilecek responsive mimari tasarla.

Aşağıdaki responsive davranışları analiz et:

- Horizontal scrolling
- Column hiding
- Priority-based columns
- Column collapsing
- Responsive column definitions
- Breakpoint bazlı column görünürlüğü
- Table görünümünden card görünümüne geçiş
- Stacked row görünümü
- Frozen veya pinned column davranışı
- Mobilde action kolonlarının konumu
- Mobilde filtreleme arayüzü
- Mobilde sorting arayüzü
- Mobilde pagination
- Mobilde column resize davranışı
- Touch gesture desteği
- Minimum touch target boyutları
- Tablet görünümü
- Landscape ve portrait farkları
- Container query kullanımı
- Media query kullanımı
- Parent container'a göre responsive davranış
- Grid'in modal, drawer veya dar sidebar içinde çalışması
- Responsive row height
- Responsive density
- Responsive typography

Responsive sistem yalnızca viewport genişliğine bağlı olmamalıdır. Grid'in yerleştirildiği container'ın genişliğine göre davranabilmesi için CSS Container Queries yaklaşımını değerlendir.

Örnek bir responsive column API öner:

```ts
{
  key: "email",
  header: "E-posta",
  responsive: {
    hiddenBelow: "md",
    priority: 3
  }
}
```

Şu tür alternatif API'leri de değerlendir:

```ts
{
  key: "address",
  visible: ({ containerWidth }) => containerWidth >= 768
}
```

Mobil görünüm için aşağıdaki seçenekleri karşılaştır:

1. Yatay kaydırılabilir klasik tablo
2. Kolonları azaltılmış kompakt tablo
3. Her satırın karta dönüştüğü görünüm
4. Kullanıcının görünür kolonları seçmesi
5. Ana kolon + expandable detail panel yaklaşımı

Her birinin avantajlarını, dezavantajlarını ve uygun kullanım alanlarını açıkla.

Paketin tek bir responsive davranışı zorunlu tutması yerine, geliştiricinin responsive stratejiyi seçebilmesini sağlayacak bir tasarım öner.

### 6. Performans

10, 100, 1.000, 10.000, 100.000 ve daha fazla satır için performans stratejisi oluştur.

Şunları analiz et:

- Row virtualization
- Column virtualization
- Overscan
- Dynamic row height
- Fixed row height
- DOM node recycling
- Memoization
- Render batching
- `requestAnimationFrame` kullanımı
- `ResizeObserver`
- `IntersectionObserver`
- Web Worker kullanımı
- Server-side filtering
- Server-side sorting
- Server-side pagination
- Infinite scrolling
- Lazy loading
- Streaming data
- Immutable update
- Partial row update
- Transaction update
- Çok sık gelen real-time verilerin yönetimi

Performans bütçesi öner:

- İlk render süresi
- Scroll sırasında frame rate
- Maksimum DOM node sayısı
- Bundle size
- Memory kullanımı
- Büyük veri setlerinde interaction latency

Virtualization ile accessibility arasındaki olası çatışmaları açıkla.

### 7. Veri modeli

Aşağıdaki kullanım biçimlerini destekleyecek veri modeli tasarla:

- Client-side data
- Server-side data
- Cursor pagination
- Offset pagination
- Infinite loading
- Lazy loading
- Tree data
- Grouped data
- Nested rows
- Expandable rows
- Streaming data
- Real-time updates
- Partial updates
- Optimistic updates

Data source interface için TypeScript örneği ver.

Örneğin aşağıdaki gibi bir sözleşmeyi değerlendir:

```ts
interface GridDataSource<T> {
  getRows(params: {
    startIndex: number;
    endIndex: number;
    sortModel: SortModel[];
    filterModel: FilterModel;
    signal: AbortSignal;
  }): Promise<{
    rows: T[];
    totalCount?: number;
  }>;
}
```

Request cancellation, race condition ve stale response sorunlarının nasıl çözüleceğini açıkla.

### 8. Erişilebilirlik

Paket WCAG uyumlu ve klavye ile tamamen kullanılabilir olmalıdır.

Şunları kapsa:

- `role="grid"`
- `row`
- `gridcell`
- `columnheader`
- `aria-rowcount`
- `aria-colcount`
- `aria-rowindex`
- `aria-colindex`
- `aria-selected`
- `aria-sort`
- Screen reader davranışları
- Keyboard navigation
- Tab, Shift+Tab
- Arrow keys
- Home, End
- Page Up, Page Down
- Enter, Space
- Escape
- Editing mode ile navigation mode ayrımı
- Focus management
- Roving tabindex
- Focus restoration
- Virtualized content için ARIA stratejisi
- Reduced motion
- High contrast
- Touch accessibility

Klavye kısayollarının özelleştirilebilir olması için API öner.

### 9. Temel özellikler

Aşağıdaki özellikleri önem derecesine göre sınıflandır:

- Sorting
- Multi-sort
- Filtering
- Global search
- Column-specific search
- Pagination
- Row selection
- Multi selection
- Range selection
- Cell selection
- Inline editing
- Validation
- Custom editors
- Column resize
- Column reorder
- Column pinning
- Column visibility
- Column grouping
- Row grouping
- Aggregation
- Tree data
- Expandable rows
- Sticky header
- Sticky footer
- Summary row
- Context menu
- Column menu
- Export CSV
- Export Excel
- Print mode
- Clipboard copy/paste
- Undo/redo
- Drag and drop
- Master-detail
- Server-side operations
- Saved grid state

Her özellik için şu bilgileri sun:

- Öncelik seviyesi
- MVP kapsamında olup olmadığı
- Teknik zorluk
- Performans etkisi
- Accessibility etkisi
- Paket boyutuna etkisi
- Plugin olarak ayrılıp ayrılamayacağı

### 10. Plugin ve extension sistemi

Core paketin gereksiz yere büyümemesi için özelliklerin plugin olarak eklenebilmesini sağlayan mimari öner.

Şunları analiz et:

- Plugin registration
- Lifecycle hooks
- Feature flags
- Tree-shaking
- Plugin dependency
- Plugin conflict
- Custom commands
- Custom events
- Custom column types
- Custom editors
- Custom renderers
- Custom filter operators
- Custom aggregation functions

TypeScript ile örnek bir plugin interface oluştur.

### 11. State management

Grid state'inin nasıl modellenmesi gerektiğini analiz et.

State içerisinde şunları değerlendir:

- Sort state
- Filter state
- Selection state
- Column order
- Column widths
- Column visibility
- Column pinning
- Expanded rows
- Pagination
- Focused cell
- Editing cell
- Density
- Responsive mode

State'in kontrollü ve kontrolsüz kullanılabilmesi için API oluştur.

Ayrıca şunları açıkla:

- State serialization
- LocalStorage kullanımı
- URL query parametrelerine state yazılması
- Backend üzerinde view kaydetme
- State migration
- Versiyonlama
- Persist edilen state ile yeni column tanımlarının birleştirilmesi

### 12. Developer experience

Paketin geliştirici açısından kolay kullanılmasını sağlayacak öneriler sun.

Şunları kapsa:

- Hata mesajları
- Development warnings
- TypeScript autocomplete
- API tutarlılığı
- Dokümantasyon
- Interactive examples
- Storybook
- Playground
- CodeSandbox örnekleri
- Migration guide
- Changelog
- Codemod
- Debug mode
- DevTools entegrasyonu
- Performance diagnostics
- Accessibility diagnostics

Yanlış yapılandırmalarda geliştiriciye gösterilecek örnek hata mesajları oluştur.

### 13. Paketleme ve dağıtım

Şunları değerlendir:

- ESM
- CommonJS gereksinimi
- TypeScript declaration
- Source map
- Tree-shaking
- Side effects
- CSS import yöntemleri
- Peer dependencies
- Optional dependencies
- Semantic versioning
- Changesets
- npm publishing
- CDN kullanımı
- Bundle size ölçümü
- Paketlerin bağımsız versiyonlanması
- CSS dosyalarının versiyonlanması
- Browser support politikası

Önerilen `package.json` export yapısına örnek ver.

### 14. Test stratejisi

Aşağıdaki test türleri için plan oluştur:

- Unit test
- Integration test
- Component test
- End-to-end test
- Visual regression test
- Accessibility test
- Performance test
- Responsive test
- Cross-browser test
- Touch interaction test
- Keyboard navigation test

Vitest, Jest, Testing Library, Playwright, Cypress, Storybook ve axe-core gibi araçları karşılaştır.

Aşağıdaki ekran genişlikleri için responsive test matrisi oluştur:

- 320 px
- 375 px
- 480 px
- 768 px
- 1024 px
- 1280 px
- 1440 px
- 1920 px

Aşağıdaki tarayıcıları değerlendir:

- Chrome
- Firefox
- Safari
- Edge
- iOS Safari
- Android Chrome

### 15. Güvenlik

Aşağıdaki riskleri analiz et:

- Cell renderer üzerinden XSS
- HTML içerik render etme
- CSV injection
- Excel formula injection
- Clipboard güvenliği
- User-generated content
- Custom renderer sandboxing
- Prototype pollution
- Server-side request parametrelerinin doğrulanması

Varsayılan olarak güvenli API tasarımı öner.

### 16. Dokümantasyon yapısı

Developerlar için hazırlanacak dokümantasyonun bilgi mimarisini oluştur.

Örnek dokümantasyon başlıkları:

- Introduction
- Installation
- Quick Start
- Core Concepts
- Column Definitions
- Styling
- Theming
- Responsive Design
- Sorting
- Filtering
- Selection
- Editing
- Virtualization
- Server-Side Data
- Accessibility
- Plugins
- API Reference
- Recipes
- Performance Guide
- Migration Guide
- Troubleshooting

Özellikle stil özelleştirme ve responsive kullanım için gerçekçi kod örnekleri sun.

### 17. Rakip analizi

Aşağıdaki kütüphaneleri karşılaştır:

- AG Grid
- TanStack Table
- MUI Data Grid
- Handsontable
- PrimeReact DataTable
- Ant Design Table
- Tabulator

Karşılaştırma kriterleri:

- API kolaylığı
- TypeScript desteği
- Performans
- Virtualization
- Responsive destek
- Mobil kullanım
- CSS özelleştirme
- Tema sistemi
- Headless kullanım
- Accessibility
- Plugin sistemi
- Framework desteği
- Paket boyutu
- Lisans modeli
- Community desteği

Bu analiz sonucunda geliştirilecek paketin net farklılaşma noktalarını çıkar.

### 18. Riskler ve teknik borç

Muhtemel riskleri ve çözüm önerilerini belirt:

- Çok fazla özellik eklenmesi
- Core paketin büyümesi
- CSS çakışmaları
- Framework adapter'larının birbirinden kopması
- Virtualization hataları
- Dynamic row height sorunları
- Mobil kullanım problemleri
- Accessibility sorunları
- State senkronizasyonu
- Server-side data race condition
- Breaking change riski
- Tarayıcı farklılıkları
- Touch ve mouse davranışı farkları

Riskleri olasılık ve etki seviyelerine göre sınıflandır.

### 19. Yol haritası

Proje için aşamalı bir yol haritası oluştur.

Önerilen aşamalar:

1. Araştırma ve prototip
2. Core state engine
3. Temel rendering
4. Column sistemi
5. Sorting ve filtering
6. Selection
7. Editing
8. CSS ve theme sistemi
9. Responsive sistem
10. Virtualization
11. Accessibility
12. Server-side data source
13. Plugin sistemi
14. Framework adapter'ları
15. Test ve optimizasyon
16. Dokümantasyon
17. Beta yayın
18. Stable sürüm

Her aşama için:

- Teslimatlar
- Teknik hedefler
- Bağımlılıklar
- Riskler
- Kabul kriterleri

belirt.

### 20. Nihai mimari önerisi

Analizin sonunda tek ve net bir mimari öneri sun.

Şu soruları kesin olarak cevapla:

- Paket headless mı, styled mı, hybrid mi olmalı?
- Framework bağımsız core gerekli mi?
- React, Vue ve Svelte paketleri nasıl ayrılmalı?
- Stil sistemi tam olarak nasıl kurulmalı?
- CSS custom properties nasıl kullanılmalı?
- Class ve slot sistemi nasıl çalışmalı?
- Responsive davranış nasıl yönetilmeli?
- Mobilde varsayılan görünüm ne olmalı?
- Virtualization hangi katmanda olmalı?
- Plugin sistemi nasıl çalışmalı?
- MVP'de hangi özellikler bulunmalı?
- Hangi özellikler ayrı plugin olmalı?
- Paketlerin önerilen klasör yapısı nasıl olmalı?

## Özellikle uygulanması gereken tasarım ilkeleri

Hazırlayacağın çözüm aşağıdaki prensiplere uymalıdır:

1. Developer-first API
2. TypeScript-first geliştirme
3. Framework-independent core
4. Progressive enhancement
5. Accessibility by default
6. Responsive by default
7. Mobile kullanımının sonradan eklenen bir özellik olmaması
8. Kolay CSS override
9. Düşük CSS specificity
10. CSS custom property tabanlı tema
11. Opsiyonel varsayılan tema
12. Unstyled kullanım seçeneği
13. Tree-shakable feature modülleri
14. Büyük veri setlerinde yüksek performans
15. Controlled ve uncontrolled kullanım
16. Server-side data desteği
17. Plugin ile genişletilebilirlik
18. Semantik ve kararlı API
19. Güvenli varsayılanlar
20. İyi hata mesajları ve güçlü developer experience

## Beklenen çıktı formatı

Yanıtı aşağıdaki sırayla hazırla:

1. Yönetici özeti
2. Problem tanımı
3. Hedef kullanıcılar
4. Rakip analizi
5. Ürün kapsamı
6. MVP özellikleri
7. Teknik mimari
8. Paket ve klasör yapısı
9. State modeli
10. TypeScript API tasarımı
11. CSS ve tema mimarisi
12. Responsive mimari
13. Mobil kullanım stratejisi
14. Virtualization ve performans
15. Accessibility
16. Plugin sistemi
17. Server-side data modeli
18. Test stratejisi
19. Güvenlik
20. Dokümantasyon
21. Risk analizi
22. Yol haritası
23. Architecture Decision Records
24. Nihai öneri
25. Uygulamaya başlanabilecek örnek başlangıç kodu

Her önemli teknik kararda aşağıdaki formatı kullan:

- Karar
- Gerekçe
- Alternatifler
- Avantajlar
- Dezavantajlar
- Riskler
- Önerilen çözüm

Tablo kullanılmasının anlamlı olduğu karşılaştırmaları tablo şeklinde sun.

Yüzeysel veya genel ifadeler kullanma. “Responsive olmalı”, “performanslı olmalı” gibi ifadeleri tek başına bırakma. Bunların nasıl uygulanacağını, hangi API ve CSS sözleşmelerinin kullanılacağını ve nasıl test edileceğini göster.

Kod örnekleri TypeScript kullanmalıdır. React örnekleri verilebilir ancak core mimari React'e bağımlı olmamalıdır.

Son bölümde aşağıdaki çıktıları ayrıca oluştur:

- Önerilen monorepo klasör ağacı
- Örnek `ColumnDef<T>` interface'i
- Örnek `GridOptions<T>` interface'i
- Örnek `GridDataSource<T>` interface'i
- Örnek plugin interface'i
- Örnek responsive column tanımı
- Örnek CSS variable tema dosyası
- Örnek dark theme
- Örnek mobil card görünümü
- Örnek custom cell renderer
- Örnek controlled state kullanımı
- Örnek server-side data kullanımı
- MVP kabul kriterleri
- Performans benchmark planı
- Responsive test matrisi
- İlk 12 aylık geliştirme yol haritası
````
