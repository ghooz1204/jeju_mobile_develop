import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getDocumentList } from '../api/OnlineExhibitionAPI';

import Loading from '../components/assets/Loading';

import { firstModalOpen } from '../store/modal';
import { setID } from '../store/exhibition';

import SwiperContainer from './SwiperContainer'
import { useHistory } from 'react-router-dom';
import { Paths } from '../paths';


const OnlineExhibitionListContainer = ({ type, setType }) => {
    const URL = "http://14.63.174.102:84";
    const history = useHistory();
    const language = useSelector(state => state.language.current);
    const inputRef = useRef();
    const autoClick = useRef()

    const leftLists = [
        {
            num: 0,
            kr_text: "온라인 전시",
            en_text: "Online-Exhibition",
            cn_text: "중국어",
            jp_text: "일본어"
        },
        {
            num: 1,
            id: "c8",
            kr_text: "음료,차류",
            en_text: "Beverages/Tea",
            cn_text: "중국어",
            jp_text: "일본어"
        },
        {
            num: 2,
            id: "c6",
            kr_text: "전통식품",
            en_text: "Traditional Foods",
            cn_text: "중국어",
            jp_text: "일본어"
        },
        {
            num: 3,
            id: "c2",
            kr_text: "가공식품",
            en_text: "Processed Foods",
            cn_text: "중국어",
            jp_text: "일본어"
        },
        {
            num: 4,
            id: "c4",
            kr_text: "건강식품",
            en_text: "Healthy Foods & supplements",
            cn_text: "중국어",
            jp_text: "일본어"
        },
        {
            num: 5,
            id: "c7",
            kr_text: "주류",
            en_text: "Alcoholic drinks",
            cn_text: "중국어",
            jp_text: "일본어"
        },
        {
            num: 6,
            id: "c3",
            kr_text: "간식",
            en_text: "Snacks",
            cn_text: "중국어",
            jp_text: "일본어"
        },
        {
            num: 7,
            id: "c10",
            kr_text: "화장품",
            en_text: "Cosmetics",
            cn_text: "중국어",
            jp_text: "일본어"
        },
        {
            num: 8,
            id: "c9",
            kr_text: "천연염색",
            en_text: "Dyed products",
            cn_text: "중국어",
            jp_text: "일본어"
        },
        {
            num: 9,
            id: "c5",
            kr_text: "마을공동체",
            en_text: "Local community",
            cn_text: "중국어",
            jp_text: "일본어"
        }
    ]

    const dispatch = useDispatch();

    const [swiper, setSwiper] = useState('');
    const [result, setResult] = useState([]);
    const [search, setSearch] = useState('');
    const [find, setFind] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exist, setExist] = useState(false);

    const onChange = e => setSearch(e.target.value);

    const listClick = (num) => { setType(parseInt(num)); setFind([]); setSearch(''); setExist(false); autoClick.current.click(); };

    const firstOpen = useCallback((id) => {
        window.scrollTo(0, 0);
        dispatch(setID(id));
        const TOKEN = localStorage.getItem('token');
        if (TOKEN) {
            history.push(Paths.exhibition + '/' + id);
        } else {
            dispatch(firstModalOpen());
        }
    }, [dispatch, history]);

    const callGetDocumentList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getDocumentList(type); // default : 0
            res.sort((a, b) => {
                return a.title < b.title ? -1 : a.title > b.title ? 1 : 0
            })
            setResult(res);
            setSwiper(<SwiperContainer dataSet={res} />);
        } catch (e) {
            alert('서버에 오류가 발생했습니다.');
            setSwiper(<SwiperContainer dataSet={"Error"} />)
        }
        setLoading(false);
    }, [type]);

    const imgError = useCallback((e) => {
        e.target.src = URL + "/data/uploaded/documents-photo_1-882.jpeg?v=1602807638";
    }, []);

    const findList = useCallback(() => {
        // 아무것도 입력 없이 찾기버튼을 눌렀을 때
        if (search === '') setExist(false);

        // 입력이 있을경우 언어별로 판단
        if (language === 'en') {
            const findItem = result.filter(item => item.title.toLowerCase().indexOf(search.toLowerCase()) > -1)
            if (findItem.length === 0) { alert("The booth does not exist."); setFind([]); setSearch(''); setExist(false); inputRef.current.focus(); }
            else { setExist(true); setFind(findItem); }
        } else if (language === 'cn') {
            const findItem = result.filter(item => item.title.indexOf(search) > -1)
            if (findItem.length === 0) { alert("중국어"); setFind([]); setSearch(''); setExist(false); inputRef.current.focus(); }
            else { setExist(true); setFind(findItem); }
        } else if (language === 'jp') {
            const findItem = result.filter(item => item.title.indexOf(search) > -1)
            if (findItem.length === 0) { alert("일본어"); setFind([]); setSearch(''); setExist(false); inputRef.current.focus(); }
            else { setExist(true); setFind(findItem); }
        } else {
            const findItem = result.filter(item => item.title.indexOf(search) > -1)
            if (findItem.length === 0) { alert("검색하신 부스가 존재하지 않습니다."); setFind([]); setSearch(''); setExist(false); inputRef.current.focus(); }
            else { setExist(true); setFind(findItem); }
        }
    }, [search, result, language])

    const handleKeyPrress = e => {
        if (e.key === 'Enter') {
            findList();
        }
    }

    useEffect(() => {
        try {
            callGetDocumentList();
        } catch (e) {
            alert('서버에 오류가 발생했습니다.');
        }
    }, [callGetDocumentList]);

    //--------------------------------------------------------------------------------------
    const LANGUAGE_PACK = {
        kr: {
            css: "",
            title: "온라인전시관",
            unit: "관",
            search: "부스명 검색"
        },
        en: {
            css: " language-en",
            title: "Online Exhibition",
            unit: "",
            search: "Booth name search"
        },
        cn: {
            css: " language-cn",
            title: "중국어",
            unit: "중국어",
            search: "중국어"
        },
        jp: {
            css: " language-jp",
            title: "일본어",
            unit: "일본어",
            search: "일본어"
        }
    }

    const current_pack = LANGUAGE_PACK[language] ? LANGUAGE_PACK[language] : LANGUAGE_PACK["kr"]
    //--------------------------------------------------------------------------------------

    return (
        <section id="on_ex_container" className={current_pack.css}>
            <div className={"subnavi" + current_pack.css}>
                <ul>
                    <li>{current_pack.title}</li>
                    <li>
                        <label for="touch">{language === 'en' ? <><strong>{leftLists[type].en_text}</strong>{current_pack.unit} </>
                            : language === 'cn' ? <><strong>{leftLists[type].cn_text}</strong>{current_pack.unit} </>
                                : language === 'jp' ? <><strong>{leftLists[type].jp_text}</strong>{current_pack.unit} </>
                                    : <><strong>{leftLists[type].kr_text}</strong>{current_pack.unit} </>}</label>
                        <input type="checkbox" id="touch" ref={autoClick} />
                        <div className={"submenu" + current_pack.css}>
                            {leftLists.map(list => (
                                list.num !== 0 &&
                                <div onClick={() => listClick(list.num)} id={list.id} >{language === 'en' ? list.en_text : language === 'cn' ? list.cn_text : language === 'jp' ? list.jp_text : list.kr_text}</div>
                            ))}
                        </div>
                    </li>
                </ul>
                <span><button type="submit"><img src={require("../static/img/ic_mo_search.png")} alt="" /></button></span>
            </div>
            <div className={"content" + current_pack.css}>
                <div className={"subtop menu01" + current_pack.css}>
                    <h3>{language === 'en' ? <><strong>{leftLists[type].en_text}</strong>{current_pack.unit} </>
                        : language === 'cn' ? <><strong>{leftLists[type].cn_text}</strong>{current_pack.unit} </>
                            : language === 'jp' ? <><strong>{leftLists[type].jp_text}</strong>{current_pack.unit} </>
                                : <><strong>{leftLists[type].kr_text}</strong>{current_pack.unit} </>}
                    </h3>
                </div>
                {swiper}
                {!loading &&
                    <div className={"bigimg" + current_pack.css}>
                        <ul>
                            {
                                !exist ?
                                    result.map(res => (
                                        <li key={res.id}>
                                            <em>{res.title}</em>
                                            <img className={"bigimgsize" + current_pack.css} src={URL + res.photo_1} onError={imgError} onClick={() => firstOpen(res.id)} alt="" />
                                        </li>
                                    ))
                                    :
                                    find.map(res => (
                                        <li key={res.id}>
                                            <em>{res.title}</em>
                                            <img className={"bigimgsize" + current_pack.css} src={URL + res.photo_1} onError={imgError} onClick={() => firstOpen(res.id)} alt="" />
                                        </li>
                                    ))
                            }
                        </ul>
                    </div>
                }
            </div>
            <Loading open={loading} />
        </section>
    )
}

export default OnlineExhibitionListContainer;