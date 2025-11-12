import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import client from "../../../Graphql/apolloClient";
import { GRAPHQL_URI } from '../../../Graphql/apolloClient';
import { ASSIGN_CREATIVES_ITEM_QUERY, GET_ASSIGNED_CONTENT, GET_ASSIGN_ECOMMERCE_ASSETS, ASSIGNED_CONTENT_COUNT, ASSIGNED_ASSETS_TOCAMPAIGN, DELETE_CONTENT_MUTATION } from "../../../Graphql/Queries";
import Image4 from "../../../assets/images/listfilter.svg";
import Image5 from "../../../assets/images/sliders@2x.png";
import Image6 from "../../../assets/images/search.svg";
import NoImage from "../../../assets/images/nomedia.jpg";
import './index.css';
import { useMutation, useQuery } from "@apollo/client";
import { Link, useLocation } from "react-router-dom";
import { format, setHours, setMinutes } from 'date-fns';
interface AssignCreativeList {
    campaignName: string;
    endDate: any;
    startDate: any;
    dealId: any;
    searchTerm: string;
    inventoryPrice: any;
    inventoryReports: any;
    inventoryType: string;
    duration: string;
    id: string;
    inventoryName: string;
    inventoryId: string;
    inventoryThumbnailUrl: string;
    inventoryDetails: {
        resolution1Width: string;
        resolution1Height: string;
        panel1Width: string;
        panel1Height: string;
        videoSupport: [];
        imageSupport: [];

    };
}
interface ApprovedCreative {
    id: string;
    masterCreativeId: string;
    status: string;
    resolution: string;
    fileName: string;
    thumbnail: string;

}
interface EcommerceAssetsList {
    id: string;
    duration: string;
    resolution: string;
    fileName: string;
    thumbnail: string;
    mimeType: string;
    metadata: {
        mediaOwnerId: string;
        dealId: string;
    }

}
interface AssignCreativeListProps {
    searchs: string;
    campaignId: string;
    inventoryIds: string[];
}
interface ContentHubList {
    id: string;
    fileName: string;
    mimeType: string;
    thumbnail: string;
    resolution: string;
    filePath: string;
}
interface CreativeCount {
    id: string;  // Or number, depending on your data
    count: number;
}
const Assign_creative_list: React.FC<AssignCreativeListProps> = ({ searchs, campaignId, inventoryIds }) => {
    const [assignCreativeList, setAssignCreativeList] = useState<AssignCreativeList[]>([]);
    const [approvedCreative, setApprovedCreative] = useState<ApprovedCreative[]>([]);
    const [approvedCreativecount, setApprovedCreativecount] = useState<CreativeCount[]>([]);
    const [ecommerceAssetsList, setEcommerceAssetsList] = useState<EcommerceAssetsList[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [assets, setAssets] = useState<EcommerceAssetsList[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number[]>([]);
    const [checkedItems, setCheckedItems] = useState(new Set());
    const [highlightedId, setHighlightedId] = useState(null);
    const [resolution, setResolution] = useState("");
    const [width, setWidth] = useState("");
    const [inventoryType, setInventoryType] = useState("");
    const [inventoryName, setInventoryName] = useState("");
    const [inventorydealId, setInventorydealId] = useState("");
    const [inventorystartDate, setInventorystartDate] = useState("");
    const [inventoryendDate, setInventoryendDate] = useState("");
    const [inventoryIdValue, setInventoryIdValue] = useState("");
    const [selectedResolutions, setSelectedResolutions] = useState<string[]>([]);
    const [selectedMimeType, setSelectedMimeType] = useState<string | null>("");
    const [filteredResults, setFilteredResults] = useState<ContentHubList[]>([]);
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [popupcurrentPage, setpopupCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [popuptotalPages, setpopupTotalPages] = useState(0);
    const [resolutionvalues, setResolutionValue] = useState<string>("");
    type Format = { type: string; format: string };
    const [formats, setFormats] = useState<Format[]>([]);
    const [resolutions, setResolutions] = useState<string[]>([]);
    const [durations, setDurations] = useState<string[]>([]);
    const inputRef = useRef(null);
    const [deleteContent] = useMutation(DELETE_CONTENT_MUTATION);
    const location = useLocation();
    const { campaignId: locationCampaignId } = location.state || {};
    const finalCampaignId = campaignId || locationCampaignId;
    const [selectedResolution, setSelectedResolution] = useState<string | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
    const [assignAsset, setAssignAsset] = useState<EcommerceAssetsList | null>(null);

    const assigncreativeList = async () => {
        const token = localStorage.getItem("authToken");
        // const id = localStorage.getItem("selectedCampaignId");
        const effectiveCampaignId = campaignId || localStorage.getItem("campaignId");

        if (!token) {
            toast.error("No authentication token found.");
            return;
        }
        setLoading(true);

        const variables = {
            accessToken: token,
            id: campaignId,
            searchTerm: searchs,
            page: (currentPage - 1).toString(),
        };

        try {
            const { data } = await client.query({
                query: ASSIGN_CREATIVES_ITEM_QUERY,
                variables
            });
            setAssignCreativeList(data.assignCreativesItem);
            const creativeItems = data.assignCreativesItem;
            setTotalPages(data.assignCreativesItem[0]?.totalPages || 0);
            const allFormats = creativeItems.flatMap((item: { inventoryDetails: { videoSupport: string[]; imageSupport: string[] } }) => [
                ...(item.inventoryDetails.videoSupport ? item.inventoryDetails.videoSupport.map((format) => ({ type: "video", format })) : []),
                ...(item.inventoryDetails.imageSupport ? item.inventoryDetails.imageSupport.map((format) => ({ type: "image", format })) : [])
            ]);

            const uniqueFormats = Array.from(
                new Map(allFormats.map((item: { type: any; format: any; }) => [`${item.type}-${item.format}`, item])).values()
            ) as Format[];

            setFormats(uniqueFormats);


            const uniqueResolutions: string[] = Array.from(
                new Set(
                    creativeItems.map((item: { inventoryDetails: { resolution1Width: any; resolution1Height: any; panel1Width: any; panel1Height: any } }) => {
                        const { resolution1Width, resolution1Height, panel1Width, panel1Height } = item.inventoryDetails;

                        let resolutionText = "";
                        let panelText = "";

                        if (resolution1Width && resolution1Height) {
                            resolutionText = `${resolution1Width} x ${resolution1Height}`;
                        }

                        if (panel1Width && panel1Height) {
                            panelText = `${panel1Width} x ${panel1Height}`;
                        }

                        if (resolutionText && panelText) {
                            return `${resolutionText}, ${panelText}`;
                        } else if (resolutionText) {
                            return resolutionText;
                        } else if (panelText) {
                            return panelText;
                        }
                        return "Resolution/Panel Not Available";
                    })
                )
            );

            setResolutions(uniqueResolutions);

            setDurations(
                Array.from(
                    new Set(
                        creativeItems.map((item: { duration: any }) => item.duration)
                    )
                )
            );

        } catch (err) {
            console.error("Fetch Content Error:", err);
            toast.error("An unexpected error occurred while fetching content");
        }
        finally {
            setLoading(false);
        }
    };
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        assigncreativeList();
    };
    const handlepopupPageChange = (page: number) => {
        if (page < 1 || page > popuptotalPages) return;
        setpopupCurrentPage(page);
        ecommerceAssets();
    };
    const token = localStorage.getItem("authToken");
    const companyId = process.env.REACT_APP_COMPANY_ID;
    const userId = localStorage.getItem("userId");
    const resolutionWidth = `${resolution}x${width}`;
    const {
        loading: loadingCartList,
        data: dataCartList,
        refetch: refetchecommerceAssetsList
    } = useQuery(GET_ASSIGN_ECOMMERCE_ASSETS, {
        variables: {
            accessToken: token,
            companyId: companyId,
            userId: userId,
            page: 0,
            resolution: resolutionWidth,
        }
    });

    useEffect(() => {
        if (dataCartList && dataCartList.ecommerceAssets) {
            setEcommerceAssetsList(dataCartList.ecommerceAssets);
            setpopupTotalPages(dataCartList?.ecommerceAssets[0].totalPages)
        }
    }, [dataCartList, setEcommerceAssetsList]);

    const ecommerceAssets = async () => {

        if (!token) {
            toast.error("No authentication token found.");
            return;
        }
        setLoading(true);
        const resolutionWidth = `${resolution}x${width}`;

        const variables = {
            accessToken: token,
            companyId: companyId,
            userId: userId,
            page: (popupcurrentPage - 1),
            resolution: resolutionWidth,
        };

        try {
            const { data } = await client.query({
                query: GET_ASSIGN_ECOMMERCE_ASSETS,
                variables
            });
            setEcommerceAssetsList(data.ecommerceAssets);
            setFilteredResults(data.ecommerceAssets);

        } catch (err) {
            console.error("Fetch Content Error:", err);
            // toast.error("An unexpected error occurred while fetching content");
        }
        finally {
            setLoading(false); // Stop loading
        }
    };

    //Approved Creative
    const approvedCreativeList = async (billboardId: string) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("No authentication token found.");
            return;
        }

        setLoading(true);

        const variables = {
            accessToken: token,
            billboardId: billboardId,
            campaignId: campaignId,
            companyId: companyId,
        };

        try {
            const { data } = await client.query({
                query: GET_ASSIGNED_CONTENT,
                variables
            });
            setApprovedCreative(data.assignedContent);

        } catch (err) {
            console.error("Fetch Content Error:", err);
            toast.error("An unexpected error occurred while fetching content");
        }
        finally {
            setLoading(false);
        }
    };
    const approvedCreativeCount = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("No authentication token found.");
            return;
        }

        setLoading(true);

        const variables = {
            accessToken: token,
            billboardIds: inventoryIds,
            companyId: companyId,
            campaignId: campaignId,
        };

        try {
            const { data } = await client.query({
                query: ASSIGNED_CONTENT_COUNT,
                variables
            });
            setApprovedCreativecount(data.assignedContentCount);

        } catch (err) {
            console.error("Fetch Content Error:", err);
            toast.error("An unexpected error occurred while fetching content");
        }
        finally {
            setLoading(false);
        }
    };
    const successModal = useRef<any>(null);
    const successLocalModal = useRef<any>(null);
    const [submit, setSubmit] = useState(false);

    const assignAssetToCampaign = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("No authentication token found.");
            return;
        }
        if (!assets || assets.length === 0) {
            toast.info("No assets selected to assign.");
            return;
        }

        setLoading(true);
        const inputs = assets.map(asset => ({
            accessToken: token,
            assetId: asset.id,
            billboardId: inventoryIdValue,
            campaignId: campaignId,
            dealId: inventorydealId,
            inventoryType: inventoryType,
            landingUrl: "",
            mediaOwnerId: asset.metadata.mediaOwnerId,
            mobileInventory: false,
            playInSequence: true,
            skippable: true,
            schedule: [
                {
                    scheduleSequence: 1,
                    startDate: inventorystartDate,
                    endDate: inventoryendDate,
                    time: [
                        {
                            startTime: "06:00",
                            endTime: "21:00",
                            executionDays: []
                        }
                    ],
                    content: [
                        {
                            contentSequence: 1,
                            status: true,
                            rules: ""
                        }
                    ]
                }
            ]
        }));
        const variables = {
            inputs: inputs
        };

        try {
            const { data } = await client.mutate({
                mutation: ASSIGNED_ASSETS_TOCAMPAIGN,
                variables
            });

            await assigncreativeList();
            await approvedCreativeCount();

            if (data && data.assignAssetToCampaign && data.assignAssetToCampaign.statusCode === 500) {
                toast.error("Internal Server Error");
                setSubmit(false);
                setLoading(false);
            } else if (data && data.assignAssetToCampaign && data.assignAssetToCampaign.message) {
                setSubmit(false);
                setLoading(false);
                setAssets([]);

                if (successModal.current) {
                    const modal = new window.bootstrap.Modal(successModal.current);
                    modal.show();
                }
            } else {
                toast.error("An unexpected error occurred.");
                setSubmit(false);
                setLoading(false);
            }
        } catch (err) {
            console.error("Error occurred:", err);
            toast.error("An unexpected error occurred while assigning assets to campaign.");
        } finally {
            setLoading(false);
        }
    };

    const [resolutionValue, setResolutionsValue] = useState('')
    const [mimetypeValue, setMimetypeValue] = useState('')
    //File Upload Drag and Drop
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const assetId = event.dataTransfer.getData('text/plain');
        const droppedAsset = filteredAssets.find((asset) => asset.id === assetId);
        const setResolution = droppedAsset?.resolution ?? '';
        const setMimetype = droppedAsset?.mimeType ?? '';
        setResolutionsValue(setResolution)
        setMimetypeValue(setMimetype)

        if (droppedAsset) {
            const isDuplicate = assets.some((asset) => asset.id === droppedAsset.id);

            if (isDuplicate) {
                toast.info('This asset has already been uploaded. Please upload a different asset.');
            } else {

                setAssets((prevAssets) => [...prevAssets, droppedAsset]);
                setAssignAsset(droppedAsset);
            }
        } else {
            const droppedFiles = Array.from(event.dataTransfer.files);
            setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
        }
    };


    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };
    const getFileDetails = (file: { type: string; }) => {
        const fileType = file.type;
        return {
            type: fileType,
        };
    };
    //File Upload
    const handleDelete = (index: any) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleAssetsDelete = (index: number) => {
        setAssets((prevAssets) => {
            const updatedAssets = [...prevAssets];
            updatedAssets.splice(index, 1);
            return updatedAssets;
        });
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const filesArray = Array.from(selectedFiles);
            setFiles((prevFiles) => [...prevFiles, ...filesArray]);

            // Process each file to extract resolution and trigger upload
            filesArray.forEach((file) => {
                renderThumbnailAndUpload(file);
            });
        }
    };

    const renderThumbnailAndUpload = (file: File) => {
        if (file.type.startsWith("video")) {
            // Handle video files
            const videoURL = URL.createObjectURL(file);
            const video = document.createElement("video");
            video.src = videoURL;

            video.onloadedmetadata = () => {
                const width = video.videoWidth;
                const height = video.videoHeight;
                const resolution = `${width}x${height}`;
                console.log(`Video resolution: ${resolution}`);
                URL.revokeObjectURL(videoURL); // Clean up the URL object

                // Pass the resolution directly to handleUpload
                handleUpload(file, resolution);
            };
        } else if (file.type.startsWith("image")) {
            // Handle image files
            const imageURL = URL.createObjectURL(file);
            const img = new Image();
            img.src = imageURL;

            img.onload = () => {
                const width = img.width;
                const height = img.height;
                const resolution = `${width}x${height}`;
                console.log(`Image resolution: ${resolution}`);
                URL.revokeObjectURL(imageURL); // Clean up the URL object

                // Pass the resolution directly to handleUpload
                handleUpload(file, resolution);
            };
        }
    };

    const handleUpload = async (file: File, resolutions: string) => {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        if (!token || !companyId || !userId) {
            toast.error("Missing authentication data.");
            return;
        }

        setIsLoading(true);
        const [expectedWidth, expectedHeight] = resolutions.split("x").map(Number);
        if (!expectedWidth || !expectedHeight) {
            toast.error("Invalid resolution format.");
            setIsLoading(false);
            return;
        }
        if (resolution === expectedWidth.toString() && width === expectedHeight.toString()) {
            setUploadProgress([0]);
            const formData = new FormData();
            formData.append(
                "operations",
                JSON.stringify({
                    query: `
                        mutation UploadContent($accessToken: String!, $file: Upload!, $mediaOwnerId: String!, $filetype: String!, $source: String!, $userId: String!) {
                            uploadcontent(
                                accessToken: $accessToken,
                                file: $file,
                                mediaOwnerId: $mediaOwnerId,
                                filetype: $filetype,
                                source: $source,
                                userId: $userId
                            ) {
                                success
                                message
                            }
                        }`,
                    variables: {
                        accessToken: token,
                        file: null,
                        mediaOwnerId: companyId,
                        filetype: "LMX_CREATIVE",
                        source: "LMX_COMMERCE",
                        userId: userId,
                    },
                })
            );
            formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
            formData.append("0", file);

            const xhr = new XMLHttpRequest();
            // Track the upload progress
            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress((prev) => {
                        const updatedProgress = [...prev];
                        updatedProgress[0] = percentComplete; // Update progress for the first file
                        return updatedProgress;
                    });
                }
            });

            xhr.open("POST", GRAPHQL_URI);
            xhr.onload = () => {
                const responseData = JSON.parse(xhr.responseText);
                if (xhr.status !== 200) {
                    toast.error(responseData.errors ? responseData.errors[0].message : "File upload failed");
                    setIsLoading(false);
                    return;
                }

                if (responseData.data.uploadcontent.success) {
                    refetchecommerceAssetsList();
                    setUploadProgress([]);
                    setPreviewUrls([]);
                    setFiles([]); // Clear selected files after successful upload
                    setIsLoading(false);
                } else {
                    toast.error(responseData.data.uploadcontent.message);
                    setIsLoading(false);
                }
            };

            xhr.onerror = () => {
                toast.error("Failed to upload file.");
                setIsLoading(false);
            };

            xhr.send(formData);
        } else {
            toast.info("Resolution does not match the expected format.");
            setIsLoading(false);
            return;
        }
    };




    //Data Search
    const handleSearchChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            performSearch(search);
        }
    }; const performSearch = (searchTerm: string) => {
        // Implement your search logic here, such as filtering items or making an API call
    };
    const popupSearchData = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
    const handleRotatePopup = () => {
        setSearchQuery('');

    }
    const filteredAssets = ecommerceAssetsList.filter(asset =>
        asset.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    useEffect(() => {
        assigncreativeList();
        approvedCreativeCount();
    }, [searchs, currentPage]);
    useEffect(() => {
        ecommerceAssets();
    }, [popupcurrentPage]);

    const handleRowClick = (id: any, inventoryName: any, inventoryId: any, type: string, dealId: string, startDate: string, endDate: string, resolution: string, width: string, panelwidth: string, panelresolution: string) => {
        const newCheckedItems = new Set(checkedItems);
        const isChecked = newCheckedItems.has(id);
        if (isChecked) {
            newCheckedItems.delete(id);
            setHighlightedId(null);
            setResolution(""); // Clear resolution when unchecked
            setWidth("");
        } else {
            newCheckedItems.add(id);
            const adjustedStartDate = setHours(setMinutes(new Date(startDate), 30), 6); // Set to 06:30
            const adjustedEndDate = setHours(setMinutes(new Date(endDate), 30), 6);   // Set to 06:30
            const formattedStartDateForDisplay = format(adjustedStartDate, 'yyyy-MM-dd\'T\'HH:mm:ss');
            const formattedEndDateForDisplay = format(adjustedEndDate, 'yyyy-MM-dd\'T\'HH:mm:ss');
            setHighlightedId(id);
            setResolution(resolution || panelresolution);
            setWidth(width || panelwidth);
            setInventoryType(type);
            setInventoryName(inventoryName);
            setInventorydealId(dealId);
            setInventorystartDate(formattedStartDateForDisplay);
            setInventoryendDate(formattedEndDateForDisplay);
            setInventoryIdValue(inventoryId);
        }
        // localStorage.setItem('billboardId', id);
        approvedCreativeList(inventoryId);
        setCheckedItems(newCheckedItems);
    };
    const handleCheckboxChange = async (id: string, inventoryName: any, inventoryId: any, type: string, dealId: string, startDate: string, endDate: string, resolution: string, width: string, panelwidth: string, panelresolution: string) => {
        const newCheckedItems = new Set(checkedItems);
        if (newCheckedItems.has(id)) {
            newCheckedItems.delete(id);
            setResolution("");
            setWidth("");
        } else {
            newCheckedItems.clear();
            newCheckedItems.add(id);
            const adjustedStartDate = setHours(setMinutes(new Date(startDate), 30), 6); // Set to 06:30
            const adjustedEndDate = setHours(setMinutes(new Date(endDate), 30), 6);   // Set to 06:30
            const formattedStartDateForDisplay = format(adjustedStartDate, 'yyyy-MM-dd\'T\'HH:mm:ss');
            const formattedEndDateForDisplay = format(adjustedEndDate, 'yyyy-MM-dd\'T\'HH:mm:ss');
            setResolution(resolution || panelresolution);
            setWidth(width || panelwidth);
            setInventoryType(type);
            setInventoryName(inventoryName);
            setInventorydealId(dealId);
            setInventorystartDate(formattedStartDateForDisplay);
            setInventoryendDate(formattedEndDateForDisplay);
            setInventoryIdValue(inventoryId);
        }

        // localStorage.setItem('billboardId', id);
        await approvedCreativeList(inventoryId);
        setCheckedItems(newCheckedItems);
    };
    const filteredCreatives = approvedCreative.filter(creative =>
        creative.fileName.toLowerCase().includes(search.toLowerCase())
    );
    const handleResolutionReset = () => {
        setSelectedResolutions([]);
        window.location.reload();
        ecommerceAssets();
    };
    const handleMimeReset = () => {
        setSelectedMimeType(null);
        window.location.reload();
        ecommerceAssets();
    };
    const handleApplyFilters = () => {
        const filteredResultss = ecommerceAssetsList.filter(content => {
            const matchesResolution = selectedResolutions.length === 0 || selectedResolutions.includes(content.resolution);
            const matchesMimeType = !selectedMimeType || content.mimeType === selectedMimeType;
            ecommerceAssets();

            return matchesResolution && matchesMimeType;

        });

        setFilteredResults(filteredResults);
    };
    const [isLoading, setIsLoading] = useState(false);
    const handleDeleteItem = (id: string) => {
        setDeleteItemId(id);
        const modal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem("authToken");
        if (!token || !deleteItemId) return;
        setIsLoading(true);
        try {
            const response = await deleteContent({ variables: { accessToken: token, contentIds: [deleteItemId] } });
            const message = response.data.deleteContent[0].message;
            if (message.startsWith("error.")) {
                toast.warn("Internal server Error");
            } else {
                toast.success(message);
                window.location.reload();
                assigncreativeList();
            }
        } catch (error) {
            toast.error("Failed to delete content");
            console.error(error);
            window.location.reload();
        } finally {
            setIsLoading(false);
            const modal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
            modal.hide();
            setDeleteItemId(null);
        }
    };
    const handleResolutionSelect = (resolution: string) => {
        setSelectedResolution(resolution);
    };

    const handleDurationSelect = (duration: string) => {
        setSelectedDuration(duration);
    };
    const handleFormatSelect = (format: string) => {
        setSelectedFormat(format);  // Update the selected format state
    };

    const filteredCreativeList = assignCreativeList.filter((billboard) => {
        // Check resolution
        const resolutionMatch = selectedResolution ? (
            `${billboard.inventoryDetails.resolution1Width} x ${billboard.inventoryDetails.resolution1Height}` === selectedResolution ||
            `${billboard.inventoryDetails.panel1Width} x ${billboard.inventoryDetails.panel1Height}` === selectedResolution
        ) : true;

        // Check duration
        const durationMatch = selectedDuration !== null ? billboard.duration === selectedDuration : true;

        // Check format
        const formatMatch = selectedFormat ? (
            [
                ...(Array.isArray(billboard.inventoryDetails.videoSupport) ? billboard.inventoryDetails.videoSupport : []),
                ...(Array.isArray(billboard.inventoryDetails.imageSupport) ? billboard.inventoryDetails.imageSupport : [])
            ].some((format: string) => format.toLowerCase() === selectedFormat.toLowerCase())
        ) : true;

        return resolutionMatch && durationMatch && formatMatch;
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);



    const handleShowImage = (asset: any) => {
        setSelectedAsset(asset);
        setShowModal(true);
    };
    const handleShow = (file: any) => {
        if (file.type?.startsWith('video')) {
            const videoUrl = URL.createObjectURL(file);
            // setSelectedAsset({ filePath: renderThumbnail(file) || videoUrl, name: file.name });
            setShowModal(true);
        } else if (file.type?.startsWith('image')) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedAsset({ filePath: imageUrl, name: file.name });
            setShowModal(true);
        } else {
            console.warn('Unsupported file type.');
        }
    };

    // const renderThumbnail = (file: any) => {
    //     if (file.type.startsWith('video')) {
    //         const videoURL = URL.createObjectURL(file);
    //         const video = document.createElement('video');
    //         video.src = videoURL;
    //         video.load();
    //         video.onloadedmetadata = () => {
    //             const width = video.videoWidth;
    //             const height = video.videoHeight;
    //             setResolutionValue(`${width} x ${height}`);
    //             console.log(`${width} x ${height}`);
    //         };
    //         return videoURL;
    //     }
    //     return URL.createObjectURL(file);
    // };

    const getImageResolution = (file: any) => {
        const img = new Image();
        const imgURL = URL.createObjectURL(file);
        img.src = imgURL;
        img.onload = () => {
            const width = img.width;
            const height = img.height;
            setResolutionValue(` ${width} x ${height}`);
        };
        return imgURL;
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAsset(null);

    };
    const handleassignSuccess = () => {
        window.location.reload();
    }
    const handleRotate = () => {
        setSearch('');
    }
    return (
        <>
            <div className="card-body d-flex">
                <div className="col-md-12 col-sm-12 col-lg-8 col-xl-8 ">
                    <div className="container assign_nav_con">
                        <div className="row align-items-center">
                            <div className="col-lg-5 col-md-4 col-sm-12 mb-3 mb-md-0">
                                <h5 className="mb-0 assign_creative_list_nav">Billboards</h5>
                            </div>

                            <div className="col-lg-7 col-md-8 col-sm-12">
                                <div className="row gx-2 gy-2">
                                    <div className="col-auto">
                                        {/* <img src={Image4} alt="" /> */}
                                        <svg className="assigncreative5-group-icon" width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.5964 0C1.17209 0 0.828125 0.343969 0.828125 0.768277C0.828125 1.19258 1.17209 1.53655 1.5964 1.53655H10.5965C11.0208 1.53655 11.3648 1.19258 11.3648 0.768277C11.3648 0.343969 11.0208 0 10.5965 0H1.5964ZM0.828125 4.49997C0.828125 4.92432 1.17212 5.26832 1.59647 5.26832H7.30377C7.72808 5.26832 8.07206 4.92434 8.07206 4.50003C8.07206 4.07573 7.72809 3.73176 7.30379 3.73175L1.59649 3.73163C1.17214 3.73162 0.828125 4.07562 0.828125 4.49997ZM0.828125 8.23172C0.828125 8.65603 1.17209 9 1.5964 9H3.57214C3.99644 9 4.34041 8.65603 4.34041 8.23172C4.34041 7.80742 3.99644 7.46345 3.57214 7.46345H1.5964C1.17209 7.46345 0.828125 7.80742 0.828125 8.23172Z"></path>
                                        </svg>
                                        <span className="assign_filter_by">Filter by:</span>
                                    </div>

                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-sm w-100 border-0 assign_drowdown_head"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                Format <i className="fa-solid fa-angle-down"></i>
                                            </button>
                                            <ul className="dropdown-menu assign_dropdown_menu">
                                                {formats.map((item, index) => (
                                                    <li key={index}>
                                                        <Link
                                                            className="dropdown-item assign_dropdown_item"
                                                            to={''}
                                                            onClick={() => handleFormatSelect(item.format.toLowerCase())}
                                                        >
                                                            {item.format.toUpperCase()}{" "}
                                                            {selectedFormat === item.format.toLowerCase() && (
                                                                <i className="fa-solid fa-check assign_fa_check"></i>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-sm w-100 border-0 assign_drowdown_head"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                Resolution <i className="fa-solid fa-angle-down"></i>
                                            </button>
                                            <ul className="dropdown-menu assign_dropdown_menu">
                                                {resolutions.map((resolution, index) => (
                                                    <li key={index}>
                                                        <Link to={''} className="dropdown-item assign_dropdown_item" onClick={() => handleResolutionSelect(resolution)}>
                                                            {resolution || 'N/A'} <i className="fa-solid fa-check assign_fa_check"></i>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-sm w-100 border-0 assign_drowdown_head"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                Duration <i className="fa-solid fa-angle-down"></i>
                                            </button>
                                            <ul className="dropdown-menu assign_dropdown_menu">
                                                {durations.map((duration, index) => (
                                                    <li key={index}>
                                                        <Link
                                                            className="dropdown-item assign_dropdown_item"
                                                            to={''}
                                                            onClick={() => handleDurationSelect(duration)}
                                                        >
                                                            {duration || "0"} sec{" "}
                                                            {selectedDuration === duration && (
                                                                <i className="fa-solid fa-check assign_fa_check"></i>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row assign_creative_card_scroll">

                        <div className="row assign-creative-tbl-head">
                            <div className="col-md-4 form-check assign_head__list_formcheck">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" />
                                <label className="form-check-label" htmlFor="flexCheckIndeterminate">
                                    <div className="c assign_list_header">Billboard Name</div>
                                </label>
                            </div>
                            <div className="col-md-2 assign_list_header_1">Format</div>
                            <div className="col-md-2 assign_list_header_1">Resolution</div>
                            <div className="col-md-2 assign_list_header_1">Duration</div>
                            <div className="col-md-2 assign_list_header_1">Action</div>

                        </div>
                        {loading ? (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '40vh' }}>
                                <span className="loading-circle sp1">
                                    <span className="loading-circle sp2">
                                        <span className="loading-circle sp3"></span>
                                    </span>
                                </span>
                            </div>
                        ) : (
                            <div className="assign-creative-list">
                                {filteredCreativeList.length > 0 ? (
                                    filteredCreativeList.map((billboard) => {
                                        const assignedContent = approvedCreativecount.find(
                                            (content: { id: string; }) => content.id === billboard.inventoryId
                                        );
                                        const videoFormats = billboard.inventoryDetails.videoSupport || [];
                                        const imageFormats = billboard.inventoryDetails.imageSupport || [];
                                        const allFormats = [...imageFormats, ...videoFormats];
                                        const allFormatsString = Array.isArray(allFormats) && allFormats.length > 0
                                            ? allFormats.join(', ')
                                            : 'N/A';
                                        return (
                                            <div
                                                key={billboard.id}
                                                className={`row align-items-center billboard-row ${highlightedId === billboard.id ? 'highlighted' : ''}`}
                                                onClick={() => handleRowClick(billboard.id, billboard.inventoryName, billboard.inventoryId, billboard.inventoryType, billboard.dealId, billboard.startDate.date, billboard.endDate.date, billboard.inventoryDetails.resolution1Width, billboard.inventoryDetails.resolution1Height, billboard.inventoryDetails.panel1Width, billboard.inventoryDetails.panel1Height)}
                                            >
                                                <div className="col-md-4 d-flex">
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedItems.has(billboard.id)}
                                                        onChange={() => handleCheckboxChange(billboard.id, billboard.inventoryName, billboard.inventoryId, billboard.inventoryType, billboard.dealId, billboard.startDate.date, billboard.endDate.date, billboard.inventoryDetails.resolution1Width, billboard.inventoryDetails.resolution1Height, billboard.inventoryDetails.panel1Width, billboard.inventoryDetails.panel1Height)}
                                                        className="mr-2 mt-3 assign_img_checkbox"
                                                    />
                                                    <img src={billboard.inventoryThumbnailUrl &&
                                                        billboard.inventoryThumbnailUrl !== "null" ?
                                                        billboard.inventoryThumbnailUrl : NoImage} alt={billboard.inventoryName} className="billboard-img assign_list_img" />
                                                    <p className="assign_list_name">{`  ${billboard.inventoryName}`}
                                                    </p>
                                                </div>
                                                <div className="col-md-2 assign_list_data">
                                                    {allFormatsString.toUpperCase()}
                                                </div>
                                                <div className="col-md-2 assign_list_data">
                                                    {billboard.inventoryDetails.resolution1Width || billboard.inventoryDetails.panel1Width || 'N/A'} X {billboard.inventoryDetails.resolution1Height || billboard.inventoryDetails.panel1Height || 'N/A'}
                                                </div>
                                                <div className="col-md-2 assign_list_data">
                                                    {billboard.duration || '0'} sec
                                                </div>
                                                <div className="col-md-2">
                                                    <p className="assign_list_data">
                                                        {assignedContent ? assignedContent.count : 0} creative uploads
                                                    </p>
                                                    <p className="assign_list_edit">Edit</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-center assign-creatives-nodata">No data found</p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="container mt-5">
                        <div className="row justify-content-end assign_navigation_container">
                            <div className="col-md-6">
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination pagenation-align">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <Link className="page-chevron-left page-link" onClick={() => handlePageChange(currentPage - 1)} to="#">
                                                <i className="fa-solid fa-angle-left"></i>
                                            </Link>
                                        </li>
                                        {Array.from({ length: totalPages }).map((_, index) => (
                                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                <Link className="page-link" onClick={() => handlePageChange(index + 1)} to="#">
                                                    {index + 1}
                                                </Link>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <Link className="page-chevron-right page-link" onClick={() => handlePageChange(currentPage + 1)} to="#">
                                                <i className="fa-solid fa-angle-right"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className="col-auto">
                                <button onClick={ecommerceAssets} className="btn btn-primary assign_pagination_button" data-bs-toggle="modal" data-bs-target="#assignCreativeModal">
                                    Assign creative
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="vr assign_vr_line d-none d-md-block"></div>
                <div className="container assign_second_container col-md-12 col-sm-12 col-lg-4 col-xl-4">
                    <p className="assign_second_con_header">Assigned creatives</p>
                    <div className="col-md-11 col-sm-10">
                        <div className="input-group assign_creative_input_group_1">
                            <span className="input-group-text search-icon assign_creative_search_icon">
                                <img src={Image6} alt="" />
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchChange}
                                className="form-control border-bottom-only assign_creative_border_bottom_only"
                                placeholder="Search creatives"
                                aria-label="Search"
                            />
                            <span>
                                <i onClick={handleRotate} className="fa-solid fa-rotate"></i>
                            </span>
                        </div>
                    </div>
                    <div className="row assign_creative_card_scroll">
                        <p className=" assign_list_names">{inventoryName}</p>
                        {filteredCreatives.length > 0 ? (
                            filteredCreatives.map((creative) => (
                                <div key={creative.id} className="row">
                                    <div className="col-md-6">
                                        <img
                                            src={creative.thumbnail}
                                            alt={creative.fileName}
                                            className="billboard-img assign_list_img_2"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <p className="assign_sec_img_content">{creative.fileName}_</p>
                                        <p className="assign_sec_img_content_1">{creative.resolution}</p>
                                        <p className={`assign_sec_img_content_2 ${creative.status.toLowerCase() === 'approved' ? 'approved-status' :
                                            creative.status.toLowerCase() === 'pending' ? 'pending-status' : ''}`}>
                                            {creative.status.toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="col-md-2">
                                        <i className="fas fa-trash-alt delete-icon assign_delete_icon" onClick={() => handleDeleteItem(creative.id)}></i>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center assign-creatives-nodata">No data found</p>
                        )}

                    </div>
                </div>


                <div className="modal fade" id="assignCreativeModal" aria-labelledby="assignCreativeLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header assign_popup_header">
                                <h5 className="modal-title assign_popup_header_title" id="assignCreativeLabel">Upload Creatives</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setFiles([]); setAssets([]); setpopupCurrentPage(1) }}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-12 col-lg-7 col-xl-7">
                                        <div className="contenthub-upload-file assign_creative_upload_line p-4 text-center"
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}>
                                            <i className="fas fa-cloud-upload-alt fa-3x mb-3"></i>
                                            <p className="assign_creative_upload_content">Drag & drop from content hub to upload</p>
                                            <h3>
                                                <input type="file" multiple onChange={handleFileChange} ref={inputRef} style={{ display: 'none' }} id="file-upload" />
                                                <label htmlFor="file-upload" className="contenthub-browse" style={{ cursor: 'pointer', color: '#014DC0' }}>or browse</label>
                                            </h3>
                                            <span className="badge assign_popup_budge">{resolution + ' x ' + width}</span>
                                            <span className="badge assign_popup_budge">{mimetypeValue}</span>
                                        </div>
                                        <div className="row">
                                            <div className="row">
                                                <div className="col-12">
                                                    <hr className="my-4 assign_border" />
                                                </div>
                                            </div>
                                            <div className="col-md-2 assign_list_header_1">Creative</div>
                                            <div className="col-md-2 assign_list_header_1"></div>
                                            <div className="col-md-2 assign_list_header_1">Format</div>
                                            <div className="col-md-2 assign_list_header_1">Resolution</div>
                                            <div className="col-md-2 assign_list_header_1">Action</div>
                                            <div className="col-md-2 assign_list_header_1"></div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <hr className="my-4 assign_border" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row assign-popup-scroll">
                                            <div className="assign_popup_list">
                                                {/* {files.length > 0 ? (
                                                    files.map((file, index) => {
                                                        const { type } = getFileDetails(file);
                                                        return (
                                                            <div key={index} className="row align-items-center billboard-row">
                                                                <div className="col-md-4 d-flex">
                                                                    {file.type.startsWith('video') ? (
                                                                        <video
                                                                            src={renderThumbnail(file)}
                                                                            className="billboard-img assign_popup_list_img"
                                                                            style={{ width: '65px', height: '55px', borderRadius: '5px' }}
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src={getImageResolution(file)}
                                                                            alt={file.name}
                                                                            className="billboard-img assign_popup_list_img"
                                                                        />
                                                                    )}
                                                                    <p className="assign_popup_list_name">{file.name}</p>
                                                                </div>
                                                                <div className="col-md-2 assign_popup_list_data">
                                                                    {type}
                                                                </div>
                                                                <div className="col-md-2 assign_popup_list_data">
                                                                    {resolutionvalues}
                                                                </div>
                                                                <div className="col-md-2 assign_popup_list_data" onClick={() => handleShow(file)}>
                                                                    <i className="fa-solid fa-eye"></i> Show
                                                                </div>
                                                                <div className="col-md-1 d-flex">
                                                                    <div className="delete-container assign_popup_delete_container">
                                                                        <i className="fas fa-trash-alt delete-icon assign_popup_delete_icon"></i>
                                                                        <span className="billboard-delete assign_creative_popup_delete" onClick={() => handleDelete(index)}>Delete</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : null} */}


                                                {assets.length > 0 ? (
                                                    assets.map((asset, index) => (
                                                        <div key={index} className="row align-items-center billboard-row">
                                                            <div className="col-md-4 d-flex">
                                                                <img
                                                                    src={asset.thumbnail}
                                                                    alt={asset.fileName}
                                                                    className="billboard-img assign_popup_list_img"
                                                                />
                                                                <p className="assign_popup_list_name">{asset.fileName}</p>
                                                            </div>
                                                            <div className="col-md-2 assign_popup_list_data">
                                                                {asset.mimeType}
                                                            </div>
                                                            <div className="col-md-2 assign_popup_list_data">
                                                                {asset.resolution}
                                                            </div>
                                                            <div className="col-md-2 assign_popup_list_data">
                                                                <span onClick={() => handleShowImage(asset)}><i className="fa-solid fa-eye"></i> Show</span>
                                                            </div>
                                                            <div className="col-md-1 d-flex">
                                                                <div className="delete-container assign_popup_delete_container">
                                                                    <i className="fas fa-trash-alt delete-icon assign_popup_delete_icon"></i>
                                                                    <span
                                                                        className="billboard-delete assign_creative_popup_delete"
                                                                        onClick={() => handleAssetsDelete(index)}
                                                                    >
                                                                        Delete
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center assign-creatives-nodata">No assets uploaded</p>
                                                )}

                                                {/* Modal for showing image */}
                                                {showModal && selectedAsset && (
                                                    <div
                                                        className="modal fade show"
                                                        style={{ display: 'block' }}
                                                        tabIndex={-1}
                                                        role="dialog"
                                                        aria-labelledby="assetModalLabel"
                                                        aria-hidden="true"
                                                    >
                                                        <div className="modal-dialog" role="document">
                                                            <div className="modal-content assign-creative-assets-content">
                                                                <div className="modal-header assign-creative-assets-header">
                                                                    <p className="modal-title" id="assetModalLabel">
                                                                        {selectedAsset.filePath?.endsWith('.mp4') || selectedAsset.name?.endsWith('.mp4')
                                                                            ? 'Creative Video'
                                                                            : 'Creative Image'}
                                                                    </p>
                                                                    <button
                                                                        type="button"
                                                                        className="close assign-creative-assets-close"
                                                                        onClick={handleCloseModal}
                                                                        aria-label="Close"
                                                                    >
                                                                        <span aria-hidden="true">&times;</span>
                                                                    </button>
                                                                </div>
                                                                <div className="modal-body text-center">
                                                                    {selectedAsset.filePath?.endsWith('.mp4') || selectedAsset.name?.endsWith('.mp4') ? (
                                                                        <video
                                                                            src={selectedAsset.filePath}
                                                                            controls
                                                                            autoPlay
                                                                            className="img-fluid"
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src={selectedAsset.filePath}
                                                                            alt={selectedAsset.name}
                                                                            className="img-fluid"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="modal-footer border-0">
                                            <button type="button" className="assign_creative_footer_btn_1" data-bs-dismiss="modal" onClick={() => { setFiles([]); setAssets([]); setpopupCurrentPage(1) }}>Close</button>
                                            <button
                                                type="button"
                                                disabled={isLoading}
                                                className="btn btn-primary assign_creative_footer_btn_2"
                                                onClick={() => {
                                                    if (files.length > 0) {
                                                        // handleUpload();
                                                    }
                                                    if (assignAsset) {
                                                        assignAssetToCampaign();
                                                    }
                                                }}
                                            >
                                                {isLoading ? ("Applying...") : ("Apply")}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-lg-5 col-xl-5">
                                        <div className="row">
                                            <h6 className="col-md-12 col-lg-12 col-xl-12">Content hub</h6>
                                            <div className="col-md-9 col-lg-8 col-xl-9">
                                                <div className="input-group assign_creative_popup_input_group">
                                                    <span className="input-group-text search-icon assign_creative_popup_search_icon">
                                                        <img src={Image6} alt="" />
                                                    </span>
                                                    <input type="text"
                                                        className="border-bottom-only no-focus-border assign_creative_popup_border_bottom_only "
                                                        placeholder="Search creatives"
                                                        value={searchQuery}
                                                        onChange={popupSearchData} />
                                                    <span>
                                                        <i onClick={handleRotatePopup} className="fa-solid fa-rotate"></i>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-lg-4 col-xl-3 d-flex">
                                                {/* <img className="assign_popup_filter_icon" src={Image5} alt="" /> */}
                                                {/* <button type="button" className="assign_creative_popup_filter" data-bs-toggle="modal" data-bs-target="#FilterRes">Filter</button> */}
                                            </div>
                                            <h6 className="col-md-12 col-lg-12 col-xl-12 assign_creative_filter_content">Supported resolution are displayed in the Requirement  Details window  based on your location</h6>

                                        </div>
                                        <div className="row assign-popup-scroll_2">

                                            <div className="row">
                                                {filteredAssets.length > 0 ? (
                                                    filteredAssets.map((ecomAssets) => (
                                                        <div
                                                            key={ecomAssets.id}
                                                            className="card col-md-5 border-0 assign_creative_popup_card"
                                                            draggable
                                                            onDragStart={(e) => e.dataTransfer.setData('text/plain', ecomAssets.id)}
                                                        >                                                            <img className="assign_creative_popup_card_img" src={ecomAssets.thumbnail} alt="" />
                                                            <div className="d-flex">
                                                                <div className="assign_popup_list_name_1">
                                                                    <p>{ecomAssets.fileName}</p>
                                                                </div>
                                                                <div className="assign_popup_list_data_1">
                                                                    {ecomAssets.duration}.sec
                                                                </div>
                                                            </div>
                                                            <div className="assign_popup_list_data">
                                                                {ecomAssets.resolution}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-md-12">
                                                        <p className="text-center assign-creatives-nodata">No Data Found</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row justify-content-end assign_navigation_container">
                                            <div className="col-auto">
                                                <nav aria-label="Page navigation example">
                                                    <ul className="pagination pagenation-align">
                                                        <li className={`page-item ${popupcurrentPage === 1 ? 'disabled' : ''}`}>
                                                            <Link className="page-chevron-left page-link" onClick={() => handlepopupPageChange(popupcurrentPage - 1)} to="#">
                                                                <i className="fa-solid fa-angle-left"></i>
                                                            </Link>
                                                        </li>
                                                        {Array.from({ length: popuptotalPages }).map((_, index) => (
                                                            <li key={index} className={`page-item ${popupcurrentPage === index + 1 ? 'active' : ''}`}>
                                                                <Link className="page-link" onClick={() => handlepopupPageChange(index + 1)} to="#">
                                                                    {index + 1}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                        <li className={`page-item ${popupcurrentPage === popuptotalPages ? 'disabled' : ''}`}>
                                                            <Link className="page-chevron-right page-link" onClick={() => handlepopupPageChange(popupcurrentPage + 1)} to="#">
                                                                <i className="fa-solid fa-angle-right"></i>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="modal fade" id="successModal" tabIndex={-1} aria-labelledby="successModalLabel" ref={successModal} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered model-xl">
                        <div className="modal-content">
                            <div className="modal-header assign_creative_apply_success_header">
                                <h5 className="modal-title assign_creative_apply_success_header_content" id="successModalLabel">Success message</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body text-center">
                                <i className="fa-regular fa-thumbs-up assign_creative_popup_success_icon"></i>
                                <p className="assign_creative_popup_success_con_2">Successfully assigned creatives to billboards</p>
                            </div>
                            <div className="modal-footer justify-content-center border-0">
                                <button type="button" className="assign_creative_footer_btn_1" data-bs-dismiss="modal" onClick={handleassignSuccess}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="successLocalModal" tabIndex={-1} aria-labelledby="successModalLabel" ref={successLocalModal} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered model-xl">
                    <div className="modal-content">
                        <div className="modal-header assign_creative_apply_success_header">
                            <h5 className="modal-title assign_creative_apply_success_header_content" id="successModalLabel">Success message</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center">
                            <i className="fa-regular fa-thumbs-up assign_creative_popup_success_icon"></i>
                            <p className="assign_creative_popup_success_con_2">Successfully assigned creatives to billboards</p>
                        </div>
                        <div className="modal-footer justify-content-center border-0">
                            <button type="button" className="assign_creative_footer_btn_1" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Filter-Resolutions-Modal */}
            <div className="modal fade" id="FilterRes" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content content-hub-filter-popup">
                        <div className="modal-header contenthub-filter-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Filters</h1>
                            <button type="button" className="contenthub-fliter-close" data-bs-dismiss="modal"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body contenthub-body row">
                            <div className="contenthub-filter-left col-md-6">
                                <h5><button data-bs-target="#FilterRes">Resolution</button></h5>
                                <h5><button data-bs-toggle="modal" data-bs-target="#FilterMime">Mime type</button></h5>
                            </div>
                            <div className="contenthub-filter-right col-md-6">
                                {Array.from(new Set(filteredResults.map(content => content.resolution)))
                                    .map((resolution, index) => (
                                        <div key={index} className="contenthub-filter-option">
                                            <div className="col-md-12">
                                                <input
                                                    type="checkbox"
                                                    id={`resolution-${index}`}
                                                    checked={selectedResolutions.includes(resolution)}
                                                    onChange={() => {
                                                        setSelectedResolutions(prev =>
                                                            prev.includes(resolution) ? prev.filter(res => res !== resolution) : [...prev, resolution]
                                                        );
                                                    }}
                                                />
                                                <label className="c-box" htmlFor={`resolution-${index}`}>{resolution}</label>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="modal-footer contenthub-popup-footer">
                            <button type="button" className="btn contenthub-filter-resetbtn" onClick={handleResolutionReset}>Reset</button>
                            <button type="button" className="btn contenthub-filter-applybtn" onClick={handleApplyFilters} data-bs-dismiss="modal">Apply filters</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter-Mimetype-Modal */}
            <div className="modal fade" id="FilterMime" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content content-hub-filter-popup">
                        <div className="modal-header contenthub-filter-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Filters</h1>
                            <button type="button" className="contenthub-fliter-close" data-bs-dismiss="modal"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body contenthub-body row">
                            <div className="contenthub-filter-left col-md-6">
                                <h5><button data-bs-toggle="modal" data-bs-target="#FilterRes">Resolution</button></h5>
                                <h5><button data-bs-target="#FilterMime">Mime type</button></h5>
                            </div>
                            <div className="contenthub-filter-right col-md-6">
                                {Array.from(new Set(filteredResults.map(content => content.mimeType)))
                                    .map((mimeType, index) => (
                                        <div key={index} className="contenthub-filter-option">
                                            <div className="col-md-12">
                                                <input
                                                    type="radio"
                                                    className="mime-type"
                                                    id={`mime-type-${index}`}
                                                    name="imageType"
                                                    checked={selectedMimeType === mimeType}
                                                    onChange={() => setSelectedMimeType(mimeType)}
                                                />
                                                <label className="c-radio" htmlFor={`mime-type-${index}`}>{mimeType}</label>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="modal-footer contenthub-popup-footer">
                            <button type="button" className="btn contenthub-filter-resetbtn" onClick={handleMimeReset}>Reset</button>
                            <button type="button" className="btn contenthub-filter-applybtn" onClick={handleApplyFilters} data-bs-dismiss="modal">Apply filters</button>
                        </div>
                    </div>
                </div>
            </div>
            {/*Delete Modal */}
            <div className="modal fade" id="deleteModal" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header cart-delete-header">
                            <h5 className="modal-title cart-delete-title" id="deleteModalLabel">Delete Item ?</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body cart-delete-body">
                            <h3 className="delete-bin"><i className="fa-solid fa-trash-arrow-up"></i></h3>
                            <h6>Do you want to delete this item ?</h6>
                        </div>
                        <div className="modal-footer cart-delete-footer">
                            <button type="button" className="cart-cancel" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="cart-delete" onClick={confirmDelete}
                                disabled={isLoading}>
                                {isLoading ? ("Deleting...") : ("Delete")}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Assign_creative_list;
