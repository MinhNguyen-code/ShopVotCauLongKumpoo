/*
========================================================================================
📋 CÂU HỎI TƯ DUY & BẢO VỆ ĐỒ ÁN (DÀNH CHO products.js)
========================================================================================
Q1: Tại sao lại lưu `productsData` dạng 1 biến Mảng tĩnh (hardcode JSON trong Variable Array) mà không gọi qua API thực lên MySQL Database?
-> Đáp án: Do website này là Bản Static Front-End xây dựng cho bài tập hoàn thiện Logic UI.
   - Việc thiết lập dữ liệu theo cấu trúc chuẩn JSON (có Object lồng nhau như Mảng `variants`, Object `specs`) giả lập y hệt data trả về từ `Fetch() / Axios` của các Restful API (như C# .NET, NodeJS trả ra JSON DB).
   - Thiết kế thế này hoàn toàn phù hợp để tương lai chuyển hóa, bóc tách thành CSDL thật cực kì dễ (chỉ việc import JSON này vào MongoDB hoặc MySQL là xong). 

Q2: Tại sao các `id` lại được viết dưới dạng "kumpoo-power-balanced-11" chứ không phải ID số như 1,2,3?
-> Đáp án: Đây gọi là kĩ thuật chuẩn Slug URL & SEO-Friendly ID. Dạng định dạng này mang cấu trúc mã hóa độc nhất (UUID string) vừa chống trùng lặp vừa làm móc nối chính xác.  
Đồng thời, file `script.js` dịch đa ngôn ngữ cần dựa vào chính key `id` string (ví dụ: `kumpoo-yangzhou`) này để dò bảng từ điển dịch thuật tên sản phẩm thay vì dò ID dạng số tối nghĩa.

Q3: Việc load một file `products.js` khổng lồ vào thẻ `<script src>` có gây nặng Web không?
-> Đáp án: Code text (Javascript text) thực tế cực nhẹ, dung lượng tính bằng Kilobyte (KB). 1.000 dòng code JSON này có dung lượng chỉ khoảng vài chục KB, trình duyệt tải trọn file này mất <0.02s mà không làm giật Lag UI. Trong thực tế, các sàn thương mại dùng API chia trang (Pagination/Lazyload), nhưng với tập dữ liệu cửa hàng Kumpoo vừa phải này, dùng Local Variable trực tiếp là hoàn toàn nhanh nhẹn.
========================================================================================
*/
const productsData = [
    {
        "id": "kumpoo-power-balanced-11",
        "name": "Vợt Cầu Lông Kumpoo Power Balanced 11",
        "slug": "kumpoo-power-balanced-11",
        "price": 599000,
        "original_price": 950000,
        "category": "Vợt Cầu Lông",
        "variants": [
            {
                "color": "Đen",
                "images": [
                    "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/Black/vot-cau-long-kumpoo-power-balanced-11-den-chinh-hang-1.webp"
                ]
            },
            {
                "color": "Xanh Dương",
                "images": [
                    "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/Blue/img-2918-9cadb908547f4290a4c2852ff566ccb6-master_1712622188.webp",
                    "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/Blue/vot-cau-long-kumpoo-balanced-11-xanh-1_1712258958.webp"
                ]
            },
            {
                "color": "Hồng",
                "images": [
                    "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/Pink/vot-cau-long-kumpoo-balanced-11-hong-1_1712258685.webp",
                    "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/Pink/vot-cau-long-kumpoo-balanced-11-hong-2_1712258693.webp",
                    "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/Pink/vot-cau-long-kumpoo-balanced-11-hong_1712258670.webp"
                ]
            },
            {
                "color": "Trắng",
                "images": [
                    "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/White/vot-cau-long-kumpoo-power-balanced-11-chinh-hang-1.webp",
                    "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/White/vot-cau-long-kumpoo-power-balanced-11-chinh-hang-2.webp",
                    "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/White/vot-cau-long-kumpoo-power-balanced-11-chinh-hang-3.webp",
                    "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/White/vot-cau-long-kumpoo-power-balanced-11-chinh-hang-4.webp"
                ]
            }
        ],
        "images": [
            "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/Black/vot-cau-long-kumpoo-power-balanced-11-den-chinh-hang-1.webp",
            "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/Blue/vot-cau-long-kumpoo-balanced-11-xanh-1_1712258958.webp",
            "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/Pink/vot-cau-long-kumpoo-balanced-11-hong-1_1712258685.webp",
            "assets/img/Vợt Cầu Lông Kumpoo Power Balanced 11/White/vot-cau-long-kumpoo-power-balanced-11-chinh-hang-1.webp"
        ],
        "specs": {
            "Trọng lượng": "82 + 2 g (4U)",
            "Độ cứng": "Trung bình",
            "Điểm cân bằng": "290 +- 5 mm (Cân bằng)",
            "Sức căng dây": "24 – 28 lbs (Tối đa 12.7 kg)",
            "Chất liệu": "Carbon Graphite",
            "Chiều dài": "675 mm"
        },
        "description": "Vợt phù hợp cho người mới tập chơi và những người có lực cổ tay yếu, đặc biệt là nữ giới."
    },
    {
        "id": "kumpoo-yangzhou",
        "name": "Vợt Cầu Lông Kumpoo YangZhou Chính Hãng",
        "slug": "kumpoo-yangzhou",
        "price": 520000,
        "original_price": 850000,
        "category": "Vợt Cầu Lông",
        "images": [
            "assets/img/Vợt Cầu Lông Kumpoo YangZhou Chính Hãng/vot-cau-long-kumpoo-yangzhou-chinh-hang_1742841353.webp",
            "assets/img/Vợt Cầu Lông Kumpoo YangZhou Chính Hãng/vot-cau-long-kumpoo-yangzhou-chinh-hang-1_1742841358.webp",
            "assets/img/Vợt Cầu Lông Kumpoo YangZhou Chính Hãng/vot-cau-long-kumpoo-yangzhou-chinh-hang-2_1742841363.webp",
            "assets/img/Vợt Cầu Lông Kumpoo YangZhou Chính Hãng/vot-cau-long-kumpoo-yangzhou-chinh-hang-3_1742841368.webp",
            "assets/img/Vợt Cầu Lông Kumpoo YangZhou Chính Hãng/vot-cau-long-kumpoo-yangzhou-chinh-hang-4_1742841373.webp"
        ],
        "specs": {
            "Trọng lượng": "82 ± 2g (4U)",
            "Độ cứng": "Trung bình",
            "Điểm cân bằng": "300 ± 5mm (Hơi nặng đầu)",
            "Sức căng dây": "Tối đa 28 lbs",
            "Color": "Trắng phối Xanh Dương",
            "Chiều dài": "675 mm"
        },
        "description": "Sự kết hợp giữa thiết kế tinh tế và hiệu suất vượt trội, màu sắc trẻ trung năng động."
    },
    {
        "id": "kumpoo-jingzhou",
        "name": "Vợt Cầu Lông Kumpoo JingZhou Chính Hãng",
        "slug": "kumpoo-jingzhou",
        "price": 520000,
        "original_price": 850000,
        "category": "Vợt Cầu Lông",
        "images": [
            "assets/img/Vợt Cầu Lông Kumpoo JingZhou Chính Hãng/vot-cau-long-kumpoo-jingzhou-chinh-hang_1742841785.webp",
            "assets/img/Vợt Cầu Lông Kumpoo JingZhou Chính Hãng/vot-cau-long-kumpoo-jingzhou-chinh-hang-1_1742841803.webp",
            "assets/img/Vợt Cầu Lông Kumpoo JingZhou Chính Hãng/vot-cau-long-kumpoo-jingzhou-chinh-hang-2_1742841808.webp",
            "assets/img/Vợt Cầu Lông Kumpoo JingZhou Chính Hãng/vot-cau-long-kumpoo-jingzhou-chinh-hang-3_1742841814.webp",
            "assets/img/Vợt Cầu Lông Kumpoo JingZhou Chính Hãng/vot-cau-long-kumpoo-jingzhou-chinh-hang-4_1742841821.webp"
        ],
        "specs": {
            "Trọng lượng": "82 ± 2g (4U)",
            "Độ cứng": "Trung bình",
            "Điểm cân bằng": "295 ± 5mm (Cân bằng)",
            "Sức căng dây": "Tối đa 28 lbs",
            "Chiều dài": "675 mm"
        },
        "description": "Thiết kế mạnh mẽ, phù hợp cho lối chơi công thủ toàn diện của người mới chơi."
    },
    {
        "id": "kumpoo-nine-tailed-fox",
        "name": "Vợt Cầu Lông Kumpoo Nine Tailed Fox (Cửu Vĩ Hồ)",
        "slug": "kumpoo-nine-tailed-fox",
        "price": 550000,
        "original_price": 890000,
        "category": "Vợt Cầu Lông",
        "images": [
            "assets/img/Vợt cầu lông Kumpoo Nine Tailed Fox (Cửu Vĩ Hồ)/vot-cau-long-kumpoo-nine-tailed-fox-cuu-vi-ho-noi-dia-trung_1724891850.webp",
            "assets/img/Vợt cầu lông Kumpoo Nine Tailed Fox (Cửu Vĩ Hồ)/vot-cau-long-kumpoo-nine-tailed-fox-cuu-vi-ho-noi-dia-trung-10_1705716574.webp",
            "assets/img/Vợt cầu lông Kumpoo Nine Tailed Fox (Cửu Vĩ Hồ)/vot-cau-long-kumpoo-nine-tailed-fox-cuu-vi-ho-noi-dia-trung-2_1705700315.webp",
            "assets/img/Vợt cầu lông Kumpoo Nine Tailed Fox (Cửu Vĩ Hồ)/vot-cau-long-kumpoo-nine-tailed-fox-cuu-vi-ho-noi-dia-trung-3_1705700309.webp",
            "assets/img/Vợt cầu lông Kumpoo Nine Tailed Fox (Cửu Vĩ Hồ)/vot-cau-long-kumpoo-nine-tailed-fox-cuu-vi-ho-noi-dia-trung-4_1705700469.webp"
        ],
        "specs": {
            "Trọng lượng": "82 ± 2g (4U)",
            "Độ cứng": "Trung bình",
            "Điểm cân bằng": "298 ± 5mm (Hơi nặng đầu)",
            "Sức căng dây": "Tối đa 28 lbs",
            "Chiều dài": "675 mm"
        },
        "description": "Thiết kế lấy cảm hứng từ Cửu Vĩ Hồ cực đẹp và huyền bí, trợ lực tốt cho người chơi."
    },
    {
        "id": "kumpoo-k520-pro",
        "name": "Vợt Cầu Lông Kumpoo K520 Pro",
        "slug": "kumpoo-k520-pro",
        "price": 429000,
        "original_price": 850000,
        "category": "Vợt Cầu Lông",
        "images": [
            "assets/img/Set Vợt Cầu Lông Kumpoo K520 Pro/Set Vợt Cầu Lông Kumpoo K520 Pro.webp"
        ],
        "specs": {
            "Trọng lượng": "82 + 2 g (4U)",
            "Độ cứng": "8.5 (Trung bình)",
            "Điểm cân bằng": "290 +- 5 mm (Cân bằng)",
            "Sức căng dây": "Tối đa 30 lbs (~13.6kg)",
            "Chất liệu": "Carbon Fiber",
            "Chiều dài": "675 mm"
        },
        "description": "Điểm cân bằng trung bình giúp cân bằng giữa tấn công và phòng thủ, phù hợp với lối đánh đa dạng."
    },
    {
        "id": "kumpoo-power-control-r89",
        "name": "Vợt Cầu Lông Kumpoo Power Control R89",
        "slug": "kumpoo-power-control-r89",
        "price": 840000,
        "original_price": 1200000,
        "category": "Vợt Cầu Lông",
        "images": [
            "assets/img/Vợt Cầu Lông Kumpoo Power Control R89/Vợt Cầu Lông Kumpoo Power Control R89.webp",
            "assets/img/Vợt Cầu Lông Kumpoo Power Control R89/vot-cau-long-kumpoo-power-control-r89-den-chinh-hang-1_1710547317.webp",
            "assets/img/Vợt Cầu Lông Kumpoo Power Control R89/vot-cau-long-kumpoo-power-control-r89-den-chinh-hang-2_1710551769.webp",
            "assets/img/Vợt Cầu Lông Kumpoo Power Control R89/vot-cau-long-kumpoo-power-control-r89-den-chinh-hang-3_1710551763.webp",
            "assets/img/Vợt Cầu Lông Kumpoo Power Control R89/vot-cau-long-kumpoo-power-control-r89-den-chinh-hang-4_1710551822.webp",
            "assets/img/Vợt Cầu Lông Kumpoo Power Control R89/vot-cau-long-kumpoo-power-control-r89-den-chinh-hang_1710539958.webp"
        ],
        "specs": {
            "Trọng lượng": "82 + 2 g (4U)",
            "Độ cứng": "8.5 (Trung bình)",
            "Điểm cân bằng": "290 +- 5 mm (Cân bằng)",
            "Sức căng dây": "28 lbs (Tối đa 12.7kg)",
            "Chất liệu": "Carbon Fiber",
            "Chiều dài": "675 mm"
        },
        "description": "Thuộc dòng vợt dễ chơi, cân bằng, thích hợp cho lối chơi công thủ toàn diện."
    },
    {
        "id": "kumpoo-power-control-e58ls",
        "name": "Vợt Cầu Lông Kumpoo Power Control E58LS",
        "slug": "kumpoo-power-control-e58ls",
        "price": 610000,
        "original_price": 950000,
        "category": "Vợt Cầu Lông",
        "images": [
            "assets/img/Vợt cầu lông Kumpoo Power Control E58LS new/Vợt cầu lông Kumpoo Power Control E58LS new.webp",
            "assets/img/Vợt cầu lông Kumpoo Power Control E58LS new/vot-cau-long-kumpoo-power-control-e58ls-new-chinh-hang-1_1709842920.webp",
            "assets/img/Vợt cầu lông Kumpoo Power Control E58LS new/vot-cau-long-kumpoo-power-control-e58ls-new-chinh-hang-2_1709842926.webp",
            "assets/img/Vợt cầu lông Kumpoo Power Control E58LS new/vot-cau-long-kumpoo-power-control-e58ls-new-chinh-hang-3_1710558930.webp"
        ],
        "specs": {
            "Trọng lượng": "82 + 2g (4U)",
            "Độ cứng": "Trung bình (8.7 ± 0.3)",
            "Điểm cân bằng": "295 +- 5 mm (Cân bằng)",
            "Sức căng dây": "24 - 28 lbs (Tối đa 12.5 kg)",
            "Chất liệu": "Carbon Graphite",
            "Chiều dài": "675 mm"
        },
        "description": "Dành cho lối đánh công thủ toàn diện, hơi thiên về tấn công mạnh mẽ với các pha đập cầu uy lực."
    },
    {
        "id": "kumpoo-b-duck-cool-set",
        "name": "SET Vợt Cầu Lông Kumpoo B.Duck Cool",
        "slug": "kumpoo-b-duck-cool-set",
        "price": 1599000,
        "original_price": 2500000,
        "category": "Bộ Sản Phẩm (Set)",
        "images": [
            "assets/img/SET Vợt Cầu Lông Kumpoo B.Duck Cool/SET Vợt Cầu Lông Kumpoo B.Duck Cool.webp",
            "assets/img/SET Vợt Cầu Lông Kumpoo B.Duck Cool/Vợt Cầu Lông Kumpoo Power Balanced 11.webp",
            "assets/img/SET Vợt Cầu Lông Kumpoo B.Duck Cool/set-vot-cau-long-kumpoo-b-duck-cool-den-chinh-hang-1_1733522091.webp",
            "assets/img/SET Vợt Cầu Lông Kumpoo B.Duck Cool/set-vot-cau-long-kumpoo-b-duck-cool-den-chinh-hang-2_1733522096.webp",
            "assets/img/SET Vợt Cầu Lông Kumpoo B.Duck Cool/set-vot-cau-long-kumpoo-b-duck-cool-den-chinh-hang-3_1733522102.webp",
            "assets/img/SET Vợt Cầu Lông Kumpoo B.Duck Cool/set-vot-cau-long-kumpoo-b-duck-cool-den-chinh-hang-4_1733522107.webp",
            "assets/img/SET Vợt Cầu Lông Kumpoo B.Duck Cool/set-vot-cau-long-kumpoo-b-duck-cool-den-chinh-hang_1733522086.webp"
        ],
        "specs": {
            "Trọng lượng": "82 ± 2g (4U)",
            "Độ cứng": "8.3 ± 0.2mm (Cứng)",
            "Điểm cân bằng": "305 ± 5mm (Nặng đầu)",
            "Sức căng dây": "Tối đa 32 lbs",
            "Chất liệu": "T800 Carbon Fiber",
            "Chiều dài": "675 mm"
        },
        "description": "Phiên bản giới hạn B.Duck với thiết kế cực cool, khung vợt ổn định cho những cú đập cầu uy lực."
    },
    {
        "id": "kumpoo-mountains-and-rivers-set",
        "name": "SET Vợt Cầu Lông Kumpoo Mountains And Rivers",
        "slug": "kumpoo-mountains-and-rivers-set",
        "price": 2250000,
        "original_price": 2850000,
        "category": "Bộ Sản Phẩm (Set)",
        "images": [
            "assets/img/SET Vợt cầu lông Kumpoo Moutains And Rivers Chính Hãng/SET Vợt cầu lông Kumpoo Moutains And Rivers Chính Hãng.webp",
            "assets/img/SET Vợt cầu lông Kumpoo Moutains And Rivers Chính Hãng/SET-vot-cau-long-Kumpoo-Moutains-And-Rivers-chinh-hang-5 (1).webp",
            "assets/img/SET Vợt cầu lông Kumpoo Moutains And Rivers Chính Hãng/SET-vot-cau-long-Kumpoo-Moutains-And-Rivers-chinh-hang-6.webp",
            "assets/img/SET Vợt cầu lông Kumpoo Moutains And Rivers Chính Hãng/set-vot-cau-long-kumpoo-moutains-and-rivers-chinh-hang-1.webp",
            "assets/img/SET Vợt cầu lông Kumpoo Moutains And Rivers Chính Hãng/set-vot-cau-long-kumpoo-moutains-and-rivers-chinh-hang-2.webp",
            "assets/img/SET Vợt cầu lông Kumpoo Moutains And Rivers Chính Hãng/set-vot-cau-long-kumpoo-moutains-and-rivers-chinh-hang-3.webp",
            "assets/img/SET Vợt cầu lông Kumpoo Moutains And Rivers Chính Hãng/set-vot-cau-long-kumpoo-moutains-and-rivers-chinh-hang-4.webp",
            "assets/img/SET Vợt cầu lông Kumpoo Moutains And Rivers Chính Hãng/set-vot-cau-long-kumpoo-moutains-and-rivers-chinh-hang-5.webp"
        ],
        "specs": {
            "Trọng lượng": "82 ± 2g (4U)",
            "Độ cứng": "Trung bình",
            "Điểm cân bằng": "305 ± 3mm (Nặng đầu)",
            "Sức căng dây": "Tối đa 32 lbs",
            "Chất liệu": "Carbon 3K & T800",
            "Chiều dài": "675 mm"
        },
        "description": "Phiên bản đặc biệt Mountains And Rivers, sử dụng chất liệu Carbon 3000 sợi cho độ bền cực cao."
    },
    {
        "id": "kumpoo-shanhai-set",
        "name": "SET Vợt Cầu Lông Kumpoo Shanhai",
        "slug": "kumpoo-shanhai-set",
        "price": 1850000,
        "original_price": 2400000,
        "category": "Bộ Sản Phẩm (Set)",
        "images": [
            "assets/img/SET vợt cầu lông Kumpoo Shanhai/SET vợt cầu lông Kumpoo Shanhai.webp",
            "assets/img/SET vợt cầu lông Kumpoo Shanhai/set-vot-cau-long-kumpoo-shanhai-noi-dia-trung-1_1741026277.webp",
            "assets/img/SET vợt cầu lông Kumpoo Shanhai/set-vot-cau-long-kumpoo-shanhai-noi-dia-trung-2_1741026283.webp"
        ],
        "specs": {
            "Trọng lượng": "4U (82 ± 2g)",
            "Độ cứng": "Trung bình - Cứng",
            "Điểm cân bằng": "305 ± 3mm (Nặng đầu)",
            "Sức căng dây": "Tối đa 32 lbs",
            "Chất liệu": "Carbon Graphite & Thermal foaming",
            "Chiều dài": "675 mm"
        },
        "description": "Thiết kế lấy cảm hứng từ Sơn Hải Kinh, công nghệ Thermal foaming giúp tăng độ ổn định của khung."
    },
    {
        "id": "kumpoo-k520-pro-plus",
        "name": "Vợt Cầu Lông Kumpoo Power Control K520 Pro Plus",
        "slug": "kumpoo-k520-pro-plus",
        "price": 550000,
        "original_price": 895000,
        "category": "Vợt Cầu Lông",
        "images": [
            "assets/img/Vợt Cầu Lông Kumpoo Power Control K520 Pro Plus - Xanh chính hãng/vot-cau-long-kumpoo-power-control-k520-pro-plus-xanh-chinh-hang-1_1759430213.webp",
            "assets/img/Vợt Cầu Lông Kumpoo Power Control K520 Pro Plus - Xanh chính hãng/vot-cau-long-kumpoo-power-control-k520-pro-plus-xanh-chinh-hang_1759430208.webp"
        ],
        "specs": {
            "Trọng lượng": "82 ± 2g (4U)",
            "Độ cứng": "8.5 (Trung bình)",
            "Điểm cân bằng": "290 ± 5 mm (Cân bằng)",
            "Sức căng dây": "Tối đa 30 lbs (~13.6kg)",
            "Chất liệu": "Carbon Fiber",
            "Chiều dài": "675 mm"
        },
        "description": "Phiên bản nâng cấp của K520 Pro với màu sắc mới và cải tiến về độ bền khung."
    },

    // ==================== GIÀY CẦU LÔNG ====================
    {
        "id": "kumpoo-giay-kh-e55-trang",
        "name": "Giày Cầu Lông Kumpoo KH-E55 Trắng Chính Hãng",
        "slug": "kumpoo-giay-kh-e55-trang",
        "price": 850000,
        "original_price": 1200000,
        "category": "Giày Cầu Lông",
        "images": [
            "assets/img/Giày cầu lông Kumpoo KH-E55 trắng chính hãng/giay-cau-long-kumpoo-kh-e55-trang-chinh-hang-1.webp"
        ],
        "specs": {
            "Màu sắc": "Trắng",
            "Chất liệu đế": "Cao su chống trượt",
            "Đế giữa": "EVA đàn hồi cao",
            "Công nghệ": "Giảm chấn KH Series",
            "Phù hợp": "Nam & Nữ"
        },
        "description": "Giày cầu lông Kumpoo KH-E55 màu trắng chính hãng — thiết kế thể thao trẻ trung, đế cao su chống trượt vượt trội, phù hợp cho mọi cấp độ người chơi."
    },
    {
        "id": "kumpoo-giay-kh-e55-den",
        "name": "Giày Cầu Lông Kumpoo KH-E55 Đen Chính Hãng",
        "slug": "kumpoo-giay-kh-e55-den",
        "price": 850000,
        "original_price": 1200000,
        "category": "Giày Cầu Lông",
        "images": [
            "assets/img/Giày cầu lông Kumpoo KH-E55 đen chính hãng/giay-cau-long-kumpoo-kh-e55-den-chinh-hang-1.webp"
        ],
        "specs": {
            "Màu sắc": "Đen",
            "Chất liệu đế": "Cao su chống trượt",
            "Đế giữa": "EVA đàn hồi cao",
            "Công nghệ": "Giảm chấn KH Series",
            "Phù hợp": "Nam & Nữ"
        },
        "description": "Giày cầu lông Kumpoo KH-E55 màu đen chính hãng — lịch lãm và bền bỉ, đế chống trượt tốt, hỗ trợ di chuyển nhanh nhẹn trong các tình huống thi đấu."
    },
    {
        "id": "kumpoo-giay-kh-g825",
        "name": "Giày Cầu Lông Kumpoo KH-G825 Chính Hãng",
        "slug": "kumpoo-giay-kh-g825",
        "price": 1150000,
        "original_price": 1650000,
        "category": "Giày Cầu Lông",
        "images": [
            "assets/img/Giày cầu lông Kumpoo KH-G825/giay-cau-long-kumpoo-kh-g825-trang-chinh-hang_1728868380.webp"
        ],
        "specs": {
            "Màu sắc": "Trắng",
            "Chất liệu đế": "Cao su non-marking",
            "Đế giữa": "PU + EVA kép",
            "Công nghệ": "G-Cushion giảm chấn",
            "Phù hợp": "Nam"
        },
        "description": "Giày cầu lông Kumpoo KH-G825 chính hãng — dòng giày cao cấp với công nghệ giảm chấn G-Cushion, bảo vệ khớp gối tối ưu cho người chơi chuyên nghiệp."
    },
    {
        "id": "kumpoo-giay-kh-g826s",
        "name": "Giày Cầu Lông Kumpoo KH-G826S Chính Hãng",
        "slug": "kumpoo-giay-kh-g826s",
        "price": 1250000,
        "original_price": 1800000,
        "category": "Giày Cầu Lông",
        "images": [
            "assets/img/Giày cầu lông Kumpoo KH-G826S/giay-cau-long-kumpoo-kh-g826s-trang-chinh-hang_1720401434.webp"
        ],
        "specs": {
            "Màu sắc": "Trắng",
            "Chất liệu đế": "Cao su non-marking",
            "Đế giữa": "Carbon Fiber plate + EVA",
            "Công nghệ": "G-Cushion Pro",
            "Phù hợp": "Nam"
        },
        "description": "Giày cầu lông Kumpoo KH-G826S chính hãng — phiên bản nâng cấp với tấm carbon plate tăng cường độ cứng, bám sân cực tốt, lý tưởng cho thi đấu cường độ cao."
    },

    // ==================== TÚI / BALO CẦU LÔNG ====================
    {
        "id": "kumpoo-tui-k432",
        "name": "Túi Cầu Lông Kumpoo K432 Chính Hãng",
        "slug": "kumpoo-tui-k432",
        "price": 350000,
        "original_price": 550000,
        "category": "Túi Cầu Lông",
        "images": [
            "assets/img/Túi cầu lông Kumpoo K432/tui-cau-long-kumpoo-k432-trang-chinh-hang_1734549416.webp",
            "assets/img/Túi cầu lông Kumpoo K432/tui-cau-long-kumpoo-k432-trang-chinh-hang-1_1734549422.webp"
        ],
        "specs": {
            "Màu sắc": "Trắng",
            "Sức chứa": "2-3 vợt",
            "Chất liệu": "Polyester cao cấp",
            "Ngăn chứa": "Ngăn chính + ngăn phụ",
            "Kiểu dáng": "Túi đeo vai"
        },
        "description": "Túi cầu lông Kumpoo K432 chính hãng — thiết kế gọn nhẹ, chứa được 2-3 vợt, chất liệu polyester bền bỉ chống thấm nước tốt, phù hợp cho người chơi bình dân."
    },
    {
        "id": "kumpoo-tui-kb-163",
        "name": "Túi Cầu Lông Kumpoo KB-163 Trắng Nâu Chính Hãng",
        "slug": "kumpoo-tui-kb-163",
        "price": 420000,
        "original_price": 650000,
        "category": "Túi Cầu Lông",
        "images": [
            "assets/img/Túi cầu lông Kumpoo KB-163 Trắng nâu chính hãng/tui-cau-long-kumpoo-kb-163-trang-nau-chinh-hang-1.webp"
        ],
        "specs": {
            "Màu sắc": "Trắng - Nâu",
            "Sức chứa": "2-3 vợt",
            "Chất liệu": "Polyester + da PU",
            "Ngăn chứa": "2 ngăn chính + 1 ngăn phụ",
            "Kiểu dáng": "Túi đeo vai"
        },
        "description": "Túi cầu lông Kumpoo KB-163 phối màu trắng nâu sang trọng — thiết kế thời trang, chất liệu da PU kết hợp polyester, bền đẹp và dễ phối đồ."
    },
    {
        "id": "kumpoo-tui-kb-268",
        "name": "Túi Cầu Lông Kumpoo KB-268 Trắng Chính Hãng",
        "slug": "kumpoo-tui-kb-268",
        "price": 480000,
        "original_price": 720000,
        "category": "Túi Cầu Lông",
        "images": [
            "assets/img/Túi cầu lông Kumpoo KB-268 Trắng chính hãng/tui-cau-long-kumpoo-kb-268-trang-chinh-hang-1.webp"
        ],
        "specs": {
            "Màu sắc": "Trắng",
            "Sức chứa": "3-4 vợt",
            "Chất liệu": "Polyester cao cấp chống thấm",
            "Ngăn chứa": "2 ngăn chính + 2 ngăn phụ",
            "Kiểu dáng": "Túi đeo vai cỡ lớn"
        },
        "description": "Túi cầu lông Kumpoo KB-268 màu trắng chính hãng — dung tích lớn chứa 3-4 vợt, nhiều ngăn tiện lợi, chất liệu chống thấm, lý tưởng cho buổi tập luyện dài."
    },
    {
        "id": "kumpoo-balo-kb369",
        "name": "Balo Cầu Lông Kumpoo KB369 Đen Chính Hãng",
        "slug": "kumpoo-balo-kb369",
        "price": 580000,
        "original_price": 890000,
        "category": "Túi Cầu Lông",
        "images": [
            "assets/img/Túi cầu lông Kumpoo KB369/balo-cau-long-kumpoo-kb369-den-chinh-hang_1728074251.webp",
            "assets/img/Túi cầu lông Kumpoo KB369/balo-cau-long-kumpoo-kb369-den-chinh-hang-1_1728074256.webp",
            "assets/img/Túi cầu lông Kumpoo KB369/balo-cau-long-kumpoo-kb369-den-chinh-hang-2_1728074266.webp"
        ],
        "specs": {
            "Màu sắc": "Đen",
            "Sức chứa": "6 vợt",
            "Chất liệu": "Polyester 600D cao cấp",
            "Ngăn chứa": "Ngăn vợt riêng + 3 ngăn phụ",
            "Kiểu dáng": "Balo đeo lưng"
        },
        "description": "Balo cầu lông Kumpoo KB369 màu đen chính hãng — sức chứa lên đến 6 vợt, thiết kế balo đeo lưng rộng rãi, dây đeo có đệm giảm áp lực vai, tiện lợi cho mọi chuyến đi."
    },

    // ==================== VỚ CẦU LÔNG ====================
    {
        "id": "kumpoo-vo-kso-07-do",
        "name": "Vớ Cầu Lông Kumpoo KSO 07 Đỏ Chính Hãng",
        "slug": "kumpoo-vo-kso-07-do",
        "price": 85000,
        "original_price": 120000,
        "category": "Vớ Cầu Lông",
        "images": [
            "assets/img/Vớ Cầu Lông Kumpoo KSO 07 Đỏ Chính Hãng/vo-cau-long-kumpoo-kso-07-do-chinh-hang_1719449364.webp"
        ],
        "specs": {
            "Màu sắc": "Đỏ",
            "Chất liệu": "Cotton + Polyester + Spandex",
            "Công nghệ": "Đệm lót tăng cường gót và mũi",
            "Kiểu dáng": "Cổ ngắn (Ankle)",
            "Phù hợp": "Nam & Nữ"
        },
        "description": "Vớ cầu lông Kumpoo KSO 07 màu đỏ chính hãng — chất liệu cotton hút ẩm tốt, đệm lót tăng cường ở gót và mũi, giảm ma sát và bảo vệ chân khi thi đấu."
    },
    {
        "id": "kumpoo-vo-kso-408-trang",
        "name": "Vớ Cầu Lông Kumpoo KSO 408 Trắng Chính Hãng",
        "slug": "kumpoo-vo-kso-408-trang",
        "price": 85000,
        "original_price": 120000,
        "category": "Vớ Cầu Lông",
        "images": [
            "assets/img/Vớ Cầu Lông Kumpoo KSO 408 Trắng Chính Hãng/vo-cau-long-kumpoo-kso-408-trang-chinh-hang_1720494657.webp"
        ],
        "specs": {
            "Màu sắc": "Trắng",
            "Chất liệu": "Cotton + Polyester + Spandex",
            "Công nghệ": "Đệm lót tăng cường gót và mũi",
            "Kiểu dáng": "Cổ ngắn (Ankle)",
            "Phù hợp": "Nam & Nữ"
        },
        "description": "Vớ cầu lông Kumpoo KSO 408 màu trắng chính hãng — thiết kế cổ ngắn gọn nhẹ, cotton cao cấp hút ẩm và thoáng khí, ôm chân tốt hỗ trợ vận động linh hoạt."
    },

    // ── DÂY CƯỚC CẦU LÔNG ─────────────────────────────
    {
        "id": "kumpoo-day-cuoc-js65",
        "name": "Dây Cước Căng Vợt Cầu Lông Kumpoo JS65",
        "slug": "kumpoo-day-cuoc-js65",
        "price": 65000,
        "original_price": 90000,
        "category": "Dây Cước Cầu Lông",
        "images": [
            "assets/img/Dây cước căng vợt cầu lông Kumpoo JS65/day-cuoc-cang-vot-cau-long-kumpoo-js65_1763145359.webp",
            "assets/img/Dây cước căng vợt cầu lông Kumpoo JS65/day-cuoc-cang-vot-cau-long-kumpoo-js65-1_1763145365.webp",
            "assets/img/Dây cước căng vợt cầu lông Kumpoo JS65/day-cuoc-cang-vot-cau-long-kumpoo-js65-2_1763145370.webp",
            "assets/img/Dây cước căng vợt cầu lông Kumpoo JS65/day-cuoc-cang-vot-cau-long-kumpoo-js65-3_1763145384.webp",
            "assets/img/Dây cước căng vợt cầu lông Kumpoo JS65/day-cuoc-cang-vot-cau-long-kumpoo-js65-4_1763145378.webp"
        ],
        "specs": {
            "Độ dày": "0.65 mm",
            "Chiều dài": "10 m / cuộn",
            "Chất liệu": "Multifilament Nylon cao cấp",
            "Độ bền": "Cao",
            "Lực căng tối đa": "28 lbs",
            "Phù hợp": "Tất cả trình độ"
        },
        "description": "Dây cước căng vợt Kumpoo JS65 — độ dày 0.65mm, chất liệu multifilament nylon cao cấp cho cảm giác cầu tốt, độ bền cao và lực căng ổn định, phù hợp với mọi trình độ thi đấu."
    },
    {
        "id": "kumpoo-day-cuoc-js67",
        "name": "Dây Cước Căng Vợt Cầu Lông Kumpoo JS67",
        "slug": "kumpoo-day-cuoc-js67",
        "price": 70000,
        "original_price": 95000,
        "category": "Dây Cước Cầu Lông",
        "images": [
            "assets/img/Dây cước căng vợt cầu lông Kumpoo JS67/day-cuoc-cang-vot-cau-long-kumpoo-js67_1763145711.webp",
            "assets/img/Dây cước căng vợt cầu lông Kumpoo JS67/day-cuoc-cang-vot-cau-long-kumpoo-js67-1_1763145726.webp",
            "assets/img/Dây cước căng vợt cầu lông Kumpoo JS67/day-cuoc-cang-vot-cau-long-kumpoo-js67-2_1763145733.webp",
            "assets/img/Dây cước căng vợt cầu lông Kumpoo JS67/day-cuoc-cang-vot-cau-long-kumpoo-js67-3_1763145741.webp",
            "assets/img/Dây cước căng vợt cầu lông Kumpoo JS67/day-cuoc-cang-vot-cau-long-kumpoo-js67-4_1763145759.webp"
        ],
        "specs": {
            "Độ dày": "0.67 mm",
            "Chiều dài": "10 m / cuộn",
            "Chất liệu": "Multifilament Nylon cao cấp",
            "Độ bền": "Rất cao",
            "Lực căng tối đa": "30 lbs",
            "Phù hợp": "Chơi mạnh & thi đấu chuyên nghiệp"
        },
        "description": "Dây cước căng vợt Kumpoo JS67 — độ dày 0.67mm dày hơn JS65, tăng cường độ bền và lực căng tối đa lên 30 lbs, lý tưởng cho lối chơi mạnh bạo và thi đấu chuyên nghiệp."
    },

    // ── QUẤN CÁN CẦU LÔNG ────────────────────────────
    {
        "id": "kumpoo-quan-can-k003",
        "name": "Quấn Cán Vợt Cầu Lông Kumpoo K003",
        "slug": "kumpoo-quan-can-k003",
        "price": 35000,
        "original_price": 50000,
        "category": "Quấn Cán Cầu Lông",
        "images": [
            "assets/img/Quấn cán vợt cầu lông Kumpoo K003/quan-can-vot-cau-long-kumpoo-k003_1721175542.webp"
        ],
        "specs": {
            "Chiều dài": "1100 mm",
            "Chiều rộng": "25 mm",
            "Độ dày": "0.7 mm",
            "Chất liệu": "PU cao cấp",
            "Tính năng": "Chống trơn, hút ẩm",
            "Phù hợp": "Tất cả loại vợt"
        },
        "description": "Quấn cán vợt Kumpoo K003 chất liệu PU cao cấp — bề mặt chống trơn, hút ẩm tốt, giúp cầm vợt chắc tay trong suốt quá trình thi đấu. Dễ dàng tự thay tại nhà."
    }
];



