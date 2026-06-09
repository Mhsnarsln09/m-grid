# Ajan Sorumluluk Matrisi

| Ajan | Birincil sorumluluk | Yazma yetkisi | Temel çıktılar |
|---|---|---:|---|
| `product_competitor_researcher` | Ürün kapsamı, rakipler, lisanslar, farklılaşma | Hayır | Rakip matrisi, MVP/Pro önerisi |
| `grid_architect` | Core, adapter, render, plugin ve paket mimarisi | Hayır | Paket ağacı, dependency kuralları, ADR adayları |
| `api_typescript_designer` | Public TypeScript API ve inference | Hayır | Interface'ler, event/state API'leri, uyumluluk riskleri |
| `styling_theming_specialist` | CSS sözleşmesi, token, slot, tema | Hayır | DOM/CSS contract, token örnekleri, override stratejisi |
| `responsive_mobile_specialist` | Container tabanlı responsive ve mobil UX | Hayır | Strateji API'si, fallback'ler, test matrisi |
| `performance_virtualization_specialist` | Virtualization, scheduling, büyük veri | Hayır | Performans bütçeleri, benchmark planı |
| `accessibility_specialist` | ARIA, klavye, focus ve AT davranışı | Hayır | A11y modeli ve kabul kriterleri |
| `data_state_specialist` | State, datasource, cancellation, persistence | Hayır | State modeli ve datasource interface'leri |
| `quality_security_specialist` | Test sistemi, CI, tehdit modeli | Hayır | Test piramidi, release gate, security kontrolleri |
| `dx_packaging_docs_specialist` | Paketleme, yayın, hata mesajları ve doküman | Hayır | Exports, docs IA, release/migration planı |
| `synthesis_reviewer` | Çelişki çözümü ve bağımsız nihai inceleme | Hayır | Mimari verdict, risk ve eksik kararlar |
| `implementation_worker` | Onaylı ve sınırlandırılmış kod değişikliği | Evet | Kod, test, doküman ve doğrulama raporu |

## Çakışma çözme önceliği

1. Güvenlik ve veri bütünlüğü
2. Accessibility ve klavye kullanılabilirliği
3. Public API uyumluluğu
4. Doğruluk
5. Responsive davranış
6. Performans
7. Styling kolaylığı
8. Paket boyutu ve DX

Bu sıra mutlak değildir. `synthesis_reviewer`, somut kullanım durumu ve ölçümle farklı bir karar verebilir.
