$(function() {
	console.log('cropper图片上传。。。');

	//触发input file
	$('#upload_btn').click(function() {
		console.log('模拟点击。。。');
		$('#btn1').trigger('click');
	});

	//图片上传
	var $image = $('.upload-img > img');
	$image.cropper({
		viewMode: 1,
		//      preview: '.img-preview', //不同尺寸预览区
		aspectRatio: 1, //裁剪比例，NaN-自由选择区域
		autoCropArea: 0.7, //初始裁剪区域占图片比例
		crop: function(data) { //裁剪操作回调
		}
	});
	var fileName; //选择上传的文件名
	$('#btn1').change(function() {
		var file = this.files[0];
		fileName = file.name;
		var reader = new FileReader();
		//reader回调，重新初始裁剪区
		reader.onload = function() {
			// 通过 reader.result 来访问生成的 DataURL
			var url = reader.result;
			//选择图片后重新初始裁剪区
			$image.cropper('reset', true).cropper('replace', url);
		};
		reader.readAsDataURL(file);
	});

	/*
	 * 上传图片
	 */
	$('#image_save').click(function() {
		var type = $image.attr('src').split(';')[0].split(':')[1];

		var canVas = $image.cropper("getCroppedCanvas", {});
		//将裁剪的图片加载到face_image
		$('#face_image').attr('src', canVas.toDataURL());
		canVas.toBlob(function(blob) {
			var formData = new FormData();
			formData.append("file", blob, fileName);

			$.ajax({
				type: "POST",
				url: '/sys/file/uploadImage.do',
				data: formData,
				contentType: false, //必须
				processData: false, //必须
				dataType: "json",
				success: function(retJson) {
					//清空上传文件的值
					$('#btn1').val('');

					//上传成功
					console.log('retJson:', retJson);
				},
				error: function() {
					//清空上传文件的值
					$(_pageId + '#btn1').val('');
				}
			});
		}, type);
	});

	//取消
	$("#image_cancel").click(function() {
		//清空上传文件的值
		$(_pageId + inputFileId).val('');
	});
});